import { IDocument } from './common';

export interface IUpload extends IDocument {
  key: string;
  mimeType: string;
}

export interface IUser {
  token: string;
  name: string;
  email: string;
  role: string;
  groupId: string;
}

export interface IDefectType extends IDocument {
  type: string;
}

export interface IUserGroup extends IDocument {
  type: string;
}

export interface IDefect extends IDocument {
  partNo: string;
  status: 'OPEN' | 'CONTAINED' | 'CLOSED';
  images: IUpload[];
  defectType: IDefectType;
}

export interface SocketMessage extends IDocument {
  defectId: string;
  text?: string;
  file?: IUpload;
  statusUpdated?: boolean;
  sender: {
    name: string;
  };
}
