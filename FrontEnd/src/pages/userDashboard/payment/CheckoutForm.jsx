import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../components/providers/AuthProvider";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [donationAmount, setDonationAmount] = useState(0);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await fetch(`http://localhost:5007/adddonationcamp/${id}`);
        const data = await response.json();
        setDonation(data);
      } catch (error) {
        console.error("Error fetching donation data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDonation();
  }, [id]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!donation || donationAmount <= 0) return;

      try {
        const res = await axiosSecure.post("/create-payment-intent", {
          donationAmount: Number(donationAmount),
          image: donation.image,
          name: donation.shortdesp,
          ownerEmail: donation.userEmail,
        });

        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.error("Error fetching clientSecret:", error);
      }
    };

    createPaymentIntent();
  }, [axiosSecure, donationAmount, donation]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("CardElement not found.");
      return;
    }

    setError("");

    try {
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setTransactionId(paymentIntent.id);

        const payment = {
          email: user.email,
          image: donation.image,
          name: donation.shortdesp,
          donationId: donation._id,
          donationAmount: Number(donationAmount),
          transactionId: paymentIntent.id,
          ownerEmail: donation.userEmail,
          max_donation_limit: donation.max_donation_limit,
          date: new Date(),
          status: "pending",
        };

        const res = await axiosSecure.post("/payments", payment);

        if (res.data?.paymentResult?.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Thank you for your donation!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (donation?.pause) return <p>Donations are currently paused.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />
      <div className="mb-5">
        <label className="mb-3 block text-base font-medium text-[#07074D]">
          Donation Amount
        </label>
        <input
          type="number"
          name="donationAmount"
          placeholder="Donation Amount"
          value={donationAmount}
          onChange={(e) => setDonationAmount(Number(e.target.value))}
          min="1"
          className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
      </div>
      <button
        className="btn btn-sm btn-primary my-4"
        type="submit"
        disabled={!stripe || !clientSecret || donation?.pause || donationAmount <= 0}
      >
        Pay
      </button>
      <p className="text-red-600">{error}</p>
      {transactionId && <p className="text-green-600">Your transaction ID: {transactionId}</p>}
    </form>
  );
};

export default CheckoutForm;
