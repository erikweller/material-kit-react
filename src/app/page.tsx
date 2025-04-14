import * as React from "react";
import { redirect } from 'next/navigation';

export default function Page(): never {
  redirect('/dashboard');
}
