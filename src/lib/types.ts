export type Profile = {
	id: string;
	name: string;
	imageUrl: string;
	email: string;

	servers?: Server[];
	members?: Member[];
	channels?: Channel[];

	createdAt?: Date;
	updatedAt?: Date;
};

export enum MemberRole {
	ADMIN = 'ADMIN',
	MODERATOR = 'MODERATOR',
	GUEST = 'GUEST',
}
export type Member = {
	id: string;
	role: MemberRole;

	profile?: Profile;

	server?: Server;

	messages?: Message[];

	createdAt: Date;
	updatedAt: Date;
};

export type Server = {
	id: string;
	name: string;
	imageUrl: string;
	inviteCode: string;

	profileId?: string;
	profile: Profile;
	members: Member[];
	channels: Channel[];

	createdAt: Date;
	updatedAt: Date;
};

export enum ChannelType {
	TEXT = 'TEXT',
	AUDIO = 'AUDIO',
	VIDEO = 'VIDEO',
}

export type Channel = {
	id: string;
	name: string;
	type: ChannelType;

	profileId?: string;
	profile?: Profile;

	serverId: string;
	server?: Server;

	messages?: Message[];

	createdAt: Date;
	updatedAt: Date;
};

export type ServerWithMembersWithProfiles = Server & {
	members: (Member & { profile: Profile })[];
};

export type Message = {
	id: string;
	content: string;
	fileUrl: string;
	member: Member;
	channel: Channel;
	deleted: boolean;
	createdAt: Date;
	updatedAt: Date;
};
export type Conversation = {
	id: string;
	memberOneId?: string;
	memberTwoId?: string;
	memberOne: Member;
	memberTwo: Member;
	directMessages: DirectMessage[];
};

export type DirectMessage = {
	id: string;
	content: string;
	fileUrl: string;
	member: Member;
	conversation: Conversation;
	deleted: boolean;
	createdAt: Date;
	updatedAt: Date;
};
