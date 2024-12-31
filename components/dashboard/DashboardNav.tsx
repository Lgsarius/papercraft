"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BurgerMenu } from "@/components/ui/burger-menu"
import {
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  Plus,
  Home,
  BookOpen,
  Calendar,
} from "lucide-react"
import { auth } from "@/app/firebase/config"
import { signOut } from "firebase/auth"
import { toast } from "sonner"

// ... rest of the code stays the same 