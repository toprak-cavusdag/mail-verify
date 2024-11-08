import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState("");
  const { token } = useParams(); // URL'den token'ı alıyoruz
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.post(
          `http://localhost:5000/api/users/verify-email/${token}`
        );
        setStatus("E-posta onayınız başarıyla tamamlandı!");
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        setStatus(
          "E-posta onayı sırasında bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <h2>E-posta Onay Durumu</h2>
      <p>{status}</p>
    </div>
  );
};

export default VerifyEmailPage;
