import React from "react"
import MDXComponents from "@theme-original/MDXComponents"

import { Button } from "@site/src/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@site/src/components/ui/card"
import { Badge } from "@site/src/components/ui/badge"
import { Alert } from "@site/src/components/ui/alert"
import { Separator } from "@site/src/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@site/src/components/ui/tabs"

// Đăng ký component shadcn để dùng trực tiếp trong mọi file .mdx, không cần import
// từng file (Docusaurus tự inject theo tên thẻ). Điểm mở rộng chính thức của
// Docusaurus — không đụng theme nội bộ nên không rủi ro khi nâng cấp phiên bản.
//
// LƯU Ý: chỉ hoạt động trong file .mdx (docs/**/*.mdx). Các tài liệu .md hiện
// có được giữ nguyên format CommonMark (xem docusaurus.config.ts) vì nội dung
// kỹ thuật chứa nhiều { } < > có thể vỡ khi ép qua MDX — xem docs/17.
export default {
  ...MDXComponents,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Alert,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
}
