import { NextResponse } from "next/server";
import { scrapeGoogleMaps } from "@/lib/apify";
import { scrapeEmails } from "@/lib/scraper";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyword, city, state, maxResults } = body;

    if (!keyword || !city || !state) {
      return NextResponse.json(
        { error: "Missing required fields: keyword, city, state" },
        { status: 400 }
      );
    }

    // 1. جلب الشركات من Google Maps عبر Apify
    const places = await scrapeGoogleMaps(keyword, city, state, Number(maxResults || 5));
    
    let emailsFoundCount = 0;
    let skippedDuplicatesCount = 0;
    const currentSearchLeads: any[] = [];

    // 2. المرور على الشركات لفحص المواقع وحفظها
    for (const place of places) {
      const companyName = place.title || "Unknown Company";
      const website = place.website || "";
      const phone = place.phone || "";
      const rating = place.totalScore || null;
      const reviews = place.reviewsCount || null;

      let emails: string[] = [];

      // محاولة فحص الموقع بحثاً عن إيميلات
      if (website) {
        try {
          emails = await scrapeEmails(website);
        } catch (scraperError) {
          console.error(`Failed to scrape emails for ${website}:`, scraperError);
        }
      }

      // حالة 1: تم العثور على إيميلات داخل الموقع
      if (emails.length > 0) {
        for (const email of emails) {
          const newLead = {
            company_name: companyName,
            website: website,
            email: email,
            phone: phone,
            city: city,
            state: state,
            rating: rating,
            reviews: reviews,
          };

          // إدخال البيانات دون استخدام .single() لتجنب انهيار الدالة في حال التكرار
          const { data: savedArray, error: insertError } = await supabase
            .from("leads")
            .insert([newLead])
            .select();

          if (insertError) {
            // إذا كان الخطأ مكرر بسبب الـ Unique Constraint في قاعدة البيانات
            if (insertError.code === "23505") {
              skippedDuplicatesCount++;
            } else {
              console.error("Insertion error:", insertError.message);
            }
            continue;
          }

          if (savedArray && savedArray.length > 0) {
            currentSearchLeads.push(savedArray[0]);
            emailsFoundCount++;
          }
        }
      } 
      // حالة 2: لم يتم العثور على إيميلات (نحفظ الشركة مفرغة الإيميل لعرضها)
      else {
        const noEmailLead = {
          company_name: companyName,
          website: website,
          email: "", 
          phone: phone,
          city: city,
          state: state,
          rating: rating,
          reviews: reviews,
        };

        const { data: savedArray, error: insertError } = await supabase
          .from("leads")
          .insert([noEmailLead])
          .select();

        if (insertError) {
          if (insertError.code === "23505") {
            skippedDuplicatesCount++;
          } else {
            console.error("Insertion error (No Email):", insertError.message);
          }
          continue;
        }

        if (savedArray && savedArray.length > 0) {
          currentSearchLeads.push(savedArray[0]);
        }
      }
    }

    // إرجاع النتائج المستقرة للواجهة الأمامية
    return NextResponse.json({
      stats: {
        companiesFound: places.length,
        emailsFound: emailsFoundCount,
        skippedDuplicates: skippedDuplicatesCount,
      },
      leads: currentSearchLeads,
    });

  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}