import { ReactNode } from "react";

export interface NavigationItem {
  id: number;
  navigate: string;
  title: string;
}
export interface NavigationProps {
  navItems: NavigationItem[];
}
export type ButtonCreativeProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: ReactNode;
};

export type UploadButtonProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  inputName?: string;
  onChange?: (event:any) => void;
};
