export interface IDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DefaultModalProps {
  isVisible: boolean;
  onHide: () => void;
}

export type ObjectValues<T> = T[keyof T];

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type StripDocument<T extends IDocument> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type TPagination = {
  limit: number;
  currentPage: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
