export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  socketId?: string;
};

export type Room = {
  id: string;
  name: string;
  users: User[];
};
