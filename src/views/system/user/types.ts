/** 用户角色 */
export type UserRole = 0 | 1;

/** 用户状态 */
export type UserStatus = 0 | 1;

/** 用户信息 VO（与后端 UserVO 对应） */
export interface UserVO {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  githubUrl?: string;
  websiteUrl?: string;
  role: UserRole;
  followerCount: number;
  followingCount: number;
  createTime: string;
}

/** 新增/编辑用户表单 */
export interface UserFormData {
  id?: number;
  username: string;
  password: string;
  nickname: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

/** 角色映射 */
export const ROLE_MAP: Record<UserRole, string> = {
  0: "普通用户",
  1: "管理员",
};

/** 状态映射 */
export const STATUS_MAP: Record<UserStatus, string> = {
  0: "禁用",
  1: "正常",
};
