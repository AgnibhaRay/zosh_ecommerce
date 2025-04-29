import { Alert, Button, CircularProgress, Snackbar, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FormikValues, useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import OTPInput from '../../../customer/components/OtpFild/OTPInput';
import { sendAdminLoginOtp, verifyAdminLogin } from '../../../Redux Toolkit/Admin/AdminAuthSlice';
import * as Yup from 'yup';

const AdminLoginForm = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { adminAuth } = useAppSelector(store => store);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
        }),
        onSubmit: (values) => {
            dispatch(verifyAdminLogin({ email: values.email, otp }))
                .unwrap()
                .then(() => {
                    navigate("/admin/dashboard");
                });
        }
    });

    const handleOtpChange = (otp: string) => {
        setOtp(otp);
    };

    const handleResendOTP = () => {
        dispatch(sendAdminLoginOtp(formik.values.email));
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleSendOtp = () => {
        if (formik.isValid && formik.values.email) {
            dispatch(sendAdminLoginOtp(formik.values.email));
            setTimer(30);
            setIsTimerActive(true);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive]);

    return (
        <div className="p-5">
            <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Admin Login</h1>
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    name="email"
                    label="Admin Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                {adminAuth.otpSent && (
                    <div className="space-y-2">
                        <p className="font-medium text-sm">
                            * Enter OTP sent to your email
                        </p>
                        <OTPInput
                            length={6}
                            onChange={handleOtpChange}
                            error={false}
                        />
                        <p className="text-xs space-x-2">
                            {isTimerActive ? (
                                <span>Resend OTP in {timer} seconds</span>
                            ) : (
                                <>
                                    Didn't receive OTP?{" "}
                                    <span
                                        onClick={handleResendOTP}
                                        className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold"
                                    >
                                        Resend OTP
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                )}

                <Button
                    fullWidth
                    variant='contained'
                    disabled={adminAuth.loading}
                    onClick={adminAuth.otpSent ? formik.submitForm : handleSendOtp}
                    sx={{ py: "11px" }}
                >
                    {adminAuth.loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        adminAuth.otpSent ? "Login" : "Send OTP"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default AdminLoginForm;