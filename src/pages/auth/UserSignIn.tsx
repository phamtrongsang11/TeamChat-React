import { SignIn } from '@clerk/clerk-react';
import React from 'react';

const UserSignIn = () => {
	return <SignIn signUpUrl="/auth/signup" />;
};

export default UserSignIn;
