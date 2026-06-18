import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("leads")
    .select("id, company_name, website, email, created_at") // جلب الحقول المطلوبة فقط لتسريع الاستعلام
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 🛡️ تحديد الأعمدة الأساسية المطلوبة فقط وحذف الباقي (الهواتف، التقييمات، إلخ)
  const headers = [
    "ID",
    "Company Name",
    "Website",
    "Email",
    "Created At",
  ];

  // ترتيب البيانات بناءً على الأعمدة الجديدة المصفاة
  const rows = (data ?? []).map((lead) => [
    lead.id,
    `"${(lead.company_name ?? "").replace(/"/g, '""')}"`,
    lead.website ?? "",
    lead.email ?? "",
    lead.created_at ?? "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
    },
  });
}