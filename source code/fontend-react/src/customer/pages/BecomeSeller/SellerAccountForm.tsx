import { Button, CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import BecomeSellerFormStep1 from "./BecomeSellerFormStep1";
import BecomeSellerFormStep3 from "./BecomeSellerFormStep3";
import BecomeSellerFormStep2 from "./BecomeSellerFormStep2";
import { useFormik } from "formik";
import * as Yup from "yup";
import BecomeSellerFormStep4 from "./BecomeSellerFormStep4";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createSeller } from "../../../Redux Toolkit/Seller/sellerAuthenticationSlice";

const steps = [
    "Tax Details & Mobile",
    "Pickup Address",
    "Bank Details",
    "Supplier Details",
  ];


const SellerAccountForm = () => {
    const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();
  const {sellerAuth}=useAppSelector(store=>store)

  const handleStep = (value: number) => {
    setActiveStep(activeStep + value);
  };

  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
      gstin: "",
      pickupAddress: {
        name: "",
        mobile: "",
        pincode: "",
        address: "",
        locality: "",
        city: "",
        state: "",
      },
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      },
      sellerName: "",
      email: "",
      businessDetails: {
        businessName: "",
        businessEmail:"",
        businessMobile:"",
        logo:"",
        banner:"",
        businessAddress:""
      },
      password: ""
    },
    validationSchema: Yup.object({
      mobile: Yup.string().required("Mobile is required"),
      gstin: Yup.string().required("GSTIN is required"),
      pickupAddress: Yup.object({
        name: Yup.string().required("Name is required"),
        mobile: Yup.string().required("Mobile is required"),
        pincode: Yup.string().required("Pincode is required"),
        address: Yup.string().required("Address is required"),
        locality: Yup.string().required("Locality is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required")
      }),
      bankDetails: Yup.object({
        accountNumber: Yup.string().required("Account number is required"),
        ifscCode: Yup.string().required("IFSC code is required"),
        accountHolderName: Yup.string().required("Account holder name is required")
      }),
      sellerName: Yup.string().required("Seller name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      businessDetails: Yup.object({
        businessName: Yup.string().required("Business name is required")
      }),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required")
    }),
    onSubmit: (values) => {
      console.log(values, "formik submitted");
      console.log("active step ", activeStep);
      dispatch(createSeller(values))
    },
  });

  const handleOtpChange = (otpValue: string) => {
    formik.setFieldValue("otp", otpValue);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
    console.log("Form Submitted");
  };



    return (
        <div>  <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
            <div className="mt-20 space-y-10">
                <div>
                    {activeStep === 0 ? (
                        <BecomeSellerFormStep1
                            formik={formik}
                            handleOtpChange={handleOtpChange}
                        />
                    ) : activeStep === 1 ? (
                        <BecomeSellerFormStep2 formik={formik} />
                    ) : activeStep === 2 ? (
                        <BecomeSellerFormStep3 formik={formik} />
                    ) : (
                        <BecomeSellerFormStep4 formik={formik} />
                    )}
                </div>

                <div className="flex items-center justify-between ">
                    <Button
                        disabled={activeStep === 0}
                        onClick={() => handleStep(-1)}
                        variant="contained"
                    >
                        Back
                    </Button>
                    <Button
                    disabled={sellerAuth.loading}
                        onClick={
                            activeStep === steps.length - 1
                                ? handleSubmit
                                : () => handleStep(1)
                        }
                        variant="contained"
                    >
                        {activeStep === steps.length - 1 ? sellerAuth.loading ? <CircularProgress size="small"
                        sx={{ width: "27px", height: "27px" }} /> : "create account" : "Continue"}
                    </Button>
                </div>
            </div> </div>
    )
}

export default SellerAccountForm