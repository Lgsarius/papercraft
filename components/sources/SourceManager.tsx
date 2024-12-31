"use client"

import { useState } from "react"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/app/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { Source } from "@/app/types"
import { useSourceContext } from "@/app/context/SourceContext"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SourceList } from "./SourceList"
import { toast } from "sonner"

// ... rest of the code stays the same 