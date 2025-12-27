interface BaseResponse {
  success: boolean;
  message: string;
  status?: number;
}
interface Paging {
  pageNo: number;
  pageSize: number;
  length: number;
}

interface ListResponseDTO<T> extends BaseResponse {
  data: {
    entities: T[];
    paging: Paging;
  };
}

interface ResponseDTO<T> extends BaseResponse {
  data: T;
}

export type ApiResourceList<T> = ListResponseDTO<T>;

export type ApiResource<T> = ResponseDTO<T>;

export type InputSanitizerType =
  | "numbers-only"
  | "letters-only"
  | "alphanumeric"
  | "phone"
  | "email"
  | "no-special-chars";

export interface SanitizerConfig {
  type: InputSanitizerType;
  maxLength?: number;
  pattern?: RegExp;
}
