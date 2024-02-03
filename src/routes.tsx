import { createBrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import ServerPage from './pages/server/ServerPage';
import AuthLayout from './pages/auth/AuthLayout';
import SetupPage from './pages/SetupPage';
import UserSignIn from './pages/auth/UserSignIn';
import UserSignUp from './pages/auth/UserSignUp';
import { ModalProvider } from './providers/ModalProvider';
import ChannelPage from './pages/channel/ChannelPage';
import InvitePage from './pages/invite/InvitePage';
import ConversationPage from './pages/conversation/ConversationPage';

const routes = createBrowserRouter([
	{
		path: '/auth',
		element: <AuthLayout />,
		children: [
			{ path: 'signin', element: <UserSignIn /> },
			{ path: 'signup', element: <UserSignUp /> },
		],
	},
	{
		path: '/',
		children: [
			{
				index: true,
				element: <SetupPage />,
			},
		],
	},
	{
		path: '/invite',
		children: [
			{
				path: '/invite/:inviteCode',
				element: <InvitePage />,
			},
		],
	},
	{
		path: '/servers',
		element: (
			<>
				<ModalProvider />
				<Layout />
			</>
		),
		children: [
			{
				path: '/servers/:serverId',
				element: <ServerPage />,
			},
			{
				path: '/servers/:serverId/channels/:channelId',
				element: <ChannelPage />,
			},
			{
				path: '/servers/:serverId/conversations/:memberId',
				element: <ConversationPage />,
			},
		],
	},
]);

export default routes;
