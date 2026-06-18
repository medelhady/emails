import { NextResponse } from "next/server";
import { scrapeGoogleMaps } from "@/lib/apify";
import { scrapeEmails } from "@/lib/scraper";
import { supabase, checkDuplicate, insertLead } from "@/lib/supabase";

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

      // إذا كان هناك موقع إلكتروني، نحاول فحص الإيميلات
      if (website) {
        try {
          emails = await scrapeEmails(website);
        } catch (scraperError) {
          console.error(`Failed to scrape emails for ${website}:`, scraperError);
        }
      }

      // إذا تم العثور على إيميلات، نقوم بحفظ كل إيميل كـ Lead منفصل
      if (emails.length > 0) {
        for (const email of emails) {
          const isDuplicate = await checkDuplicate(website, email);
          if (isDuplicate) {
            skippedDuplicatesCount++;
            continue;
          }

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

          try {
            const saved = await insertLead(newLead);
            if (saved) {
              currentSearchLeads.push(saved);
              emailsFoundCount++;
            }
          } catch (dbError) {
            console.error("Database insert error:", dbError);
          }
        }
      } else {
        // التعديل الجوهري: إذا لم يجد إيميل، نحفظ الشركة مفرغة الإيميل لكي تظهر بالجدول!
        // نتحقق أولاً بالاعتماد على الموقع إذا كان مكرراً
        const isDuplicate = website ? await checkDuplicate(website, "") : false;
        
        if (isDuplicate) {
          skippedDuplicatesCount++;
          continue;
        }

        const noEmailLead = {
          company_name: companyName,
          website: website,
          email: "", // فارغ
          phone: phone,
          city: city,
          state: state,
          rating: rating,
          reviews: reviews,
        };

        try {
          const saved = await insertLead(noEmailLead);
          if (saved) {
            currentSearchLeads.push(saved);
          }
        } catch (dbError) {
          console.error("Database insert error for empty email lead:", dbError);
        }
      }
    }

    // إرجاع الإحصائيات مع قائمة البيانات التي تم جلبها في هذا البحث لعرضها فوراً
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