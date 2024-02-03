import { SignUp } from '@clerk/clerk-react';
import React from 'react';

const UserSignUp = () => {
	return <SignUp signInUrl="/auth/signin" />;
};

export default UserSignUp;
