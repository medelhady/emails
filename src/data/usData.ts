export interface CityInfo {
  id: string;
  name: string;
}

export interface StateInfo {
  id: string;
  name: string;
  cities: CityInfo[]; // المقاطعات (Counties) مرتبة تنازلياً حسب الكثافة السكانية وسوق العقارات
}

export const usStates: StateInfo[] = [
  {
    id: "CA",
    name: "California (CA)",
    cities: [
      { id: "la_county", name: "Los Angeles County" },
      { id: "sd_county", name: "San Diego County" },
      { id: "orange_county", name: "Orange County" },
      { id: "riverside_county", name: "Riverside County" },
      { id: "sb_county", name: "San Bernardino County" },
      { id: "sc_county", name: "Santa Clara County" },
      { id: "alameda_county", name: "Alameda County" },
      { id: "sacramento_county", name: "Sacramento County" }
    ]
  },
  {
    id: "TX",
    name: "Texas (TX)",
    cities: [
      { id: "harris_county", name: "Harris County (Houston)" },
      { id: "dallas_county", name: "Dallas County" },
      { id: "tarrant_county", name: "Tarrant County (Fort Worth)" },
      { id: "bexar_county", name: "Bexar County (San Antonio)" },
      { id: "travis_county", name: "Travis County (Austin)" },
      { id: "collin_county", name: "Collin County" },
      { id: "denton_county", name: "Denton County" }
    ]
  },
  {
    id: "FL",
    name: "Florida (FL)",
    cities: [
      { id: "miami_dade", name: "Miami-Dade County" },
      { id: "broward_county", name: "Broward County" },
      { id: "palm_beach", name: "Palm Beach County" },
      { id: "hillsborough", name: "Hillsborough County (Tampa)" },
      { id: "orange_fl", name: "Orange County (Orlando)" },
      { id: "duval_county", name: "Duval County (Jacksonville)" },
      { id: "pinellas_county", name: "Pinellas County" }
    ]
  },
  {
    id: "NY",
    name: "New York (NY)",
    cities: [
      { id: "kings_county", name: "Kings County (Brooklyn)" },
      { id: "queens_county", name: "Queens County" },
      { id: "new_york_county", name: "New York County (Manhattan)" },
      { id: "bronx_county", name: "Bronx County" },
      { id: "suffolk_county", name: "Suffolk County" },
      { id: "nassau_county", name: "Nassau County" },
      { id: "erie_county", name: "Erie County (Buffalo)" }
    ]
  },
  {
    id: "PA",
    name: "Pennsylvania (PA)",
    cities: [
      { id: "philadelphia_county", name: "Philadelphia County" },
      { id: "allegheny_county", name: "Allegheny County (Pittsburgh)" },
      { id: "montgomery_pa", name: "Montgomery County" },
      { id: "bucks_county", name: "Bucks County" },
      { id: "delaware_pa", name: "Delaware County" }
    ]
  },
  {
    id: "IL",
    name: "Illinois (IL)",
    cities: [
      { id: "cook_county", name: "Cook County (Chicago)" },
      { id: "dupage_county", name: "DuPage County" },
      { id: "lake_il", name: "Lake County" },
      { id: "will_county", name: "Will County" },
      { id: "kane_county", name: "Kane County" }
    ]
  },
  {
    id: "OH",
    name: "Ohio (OH)",
    cities: [
      { id: "franklin_oh", name: "Franklin County (Columbus)" },
      { id: "cuyahoga_county", name: "Cuyahoga County (Cleveland)" },
      { id: "hamilton_oh", name: "Hamilton County (Cincinnati)" },
      { id: "summit_county", name: "Summit County" },
      { id: "lucas_county", name: "Lucas County" }
    ]
  },
  {
    id: "GA",
    name: "Georgia (GA)",
    cities: [
      { id: "fulton_ga", name: "Fulton County (Atlanta)" },
      { id: "gwinnett_county", name: "Gwinnett County" },
      { id: "dekalb_county", name: "DeKalb County" },
      { id: "cobb_county", name: "Cobb County" },
      { id: "chatham_county", name: "Chatham County" }
    ]
  },
  {
    id: "NC",
    name: "North Carolina (NC)",
    cities: [
      { id: "wake_county", name: "Wake County (Raleigh)" },
      { id: "mecklenburg_nc", name: "Mecklenburg County (Charlotte)" },
      { id: "guilford_county", name: "Guilford County" },
      { id: "forsyth_county", name: "Forsyth County" }
    ]
  },
  {
    id: "MI",
    name: "Michigan (MI)",
    cities: [
      { id: "wayne_mi", name: "Wayne County (Detroit)" },
      { id: "oakland_county", name: "Oakland County" },
      { id: "macomb_county", name: "Macomb County" },
      { id: "kent_county", name: "Kent County (Grand Rapids)" }
    ]
  },
  {
    id: "NJ",
    name: "New Jersey (NJ)",
    cities: [
      { id: "bergen_county", name: "Bergen County" },
      { id: "essex_nj", name: "Essex County" },
      { id: "middlesex_nj", name: "Middlesex County" },
      { id: "hudson_nj", name: "Hudson County" }
    ]
  },
  {
    id: "VA",
    name: "Virginia (VA)",
    cities: [
      { id: "fairfax_county", name: "Fairfax County" },
      { id: "prince_william", name: "Prince William County" },
      { id: "virginia_beach", name: "Virginia Beach (City)" },
      { id: "loudoun_county", name: "Loudoun County" }
    ]
  },
  {
    id: "WA",
    name: "Washington (WA)",
    cities: [
      { id: "king_wa", name: "King County (Seattle)" },
      { id: "pierce_wa", name: "Pierce County" },
      { id: "snohomish", name: "Snohomish County" },
      { id: "spokane", name: "Spokane County" }
    ]
  },
  {
    id: "AZ",
    name: "Arizona (AZ)",
    cities: [
      { id: "maricopa", name: "Maricopa County (Phoenix)" },
      { id: "pima", name: "Pima County (Tucson)" },
      { id: "pinal", name: "Pinal County" }
    ]
  },
  {
    id: "MA",
    name: "Massachusetts (MA)",
    cities: [
      { id: "middlesex_ma", name: "Middlesex County" },
      { id: "suffolk_ma", name: "Suffolk County (Boston)" },
      { id: "essex_ma", name: "Essex County" },
      { id: "worcester_ma", name: "Worcester County" }
    ]
  },
  {
    id: "TN",
    name: "Tennessee (TN)",
    cities: [
      { id: "shelby_tn", name: "Shelby County (Memphis)" },
      { id: "davidson_tn", name: "Davidson County (Nashville)" },
      { id: "knox_tn", name: "Knox County" }
    ]
  },
  {
    id: "IN",
    name: "Indiana (IN)",
    cities: [
      { id: "marion_in", name: "Marion County (Indianapolis)" },
      { id: "lake_in", name: "Lake County" },
      { id: "allen_in", name: "Allen County" }
    ]
  },
  {
    id: "MD",
    name: "Maryland (MD)",
    cities: [
      { id: "montgomery_md", name: "Montgomery County" },
      { id: "prince_georges", name: "Prince George's County" },
      { id: "baltimore_county", name: "Baltimore County" }
    ]
  },
  {
    id: "MO",
    name: "Missouri (MO)",
    cities: [
      { id: "st_louis_county", name: "St. Louis County" },
      { id: "jackson_mo", name: "Jackson County (Kansas City)" },
      { id: "greene_mo", name: "Greene County" }
    ]
  },
  {
    id: "WI",
    name: "Wisconsin (WI)",
    cities: [
      { id: "milwaukee", name: "Milwaukee County" },
      { id: "dane", name: "Dane County (Madison)" },
      { id: "waukesha", name: "Waukesha County" }
    ]
  },
  {
    id: "CO",
    name: "Colorado (CO)",
    cities: [
      { id: "el_paso_co", name: "El Paso County (Colorado Springs)" },
      { id: "denver", name: "Denver County" },
      { id: "arapahoe", name: "Arapahoe County" }
    ]
  },
  {
    id: "MN",
    name: "Minnesota (MN)",
    cities: [
      { id: "hennepin", name: "Hennepin County (Minneapolis)" },
      { id: "ramsey", name: "Ramsey County (St. Paul)" },
      { id: "dakota", name: "Dakota County" }
    ]
  },
  {
    id: "SC",
    name: "South Carolina (SC)",
    cities: [
      { id: "greenville", name: "Greenville County" },
      { id: "richland", name: "Richland County (Columbia)" },
      { id: "charleston", name: "Charleston County" }
    ]
  },
  {
    id: "AL",
    name: "Alabama (AL)",
    cities: [
      { id: "jefferson_al", name: "Jefferson County (Birmingham)" },
      { id: "mobile", name: "Mobile County" },
      { id: "madison_al", name: "Madison County (Huntsville)" }
    ]
  },
  {
    id: "LA",
    name: "Louisiana (LA)",
    cities: [
      { id: "east_baton_rouge", name: "East Baton Rouge Parish" },
      { id: "orleans_parish", name: "Orleans Parish (New Orleans)" },
      { id: "caddo", name: "Caddo Parish" }
    ]
  },
  {
    id: "KY",
    name: "Kentucky (KY)",
    cities: [
      { id: "jefferson_ky", name: "Jefferson County (Louisville)" },
      { id: "fayette", name: "Fayette County (Lexington)" },
      { id: "kenton", name: "Kenton County" }
    ]
  },
  {
    id: "OR",
    name: "Oregon (OR)",
    cities: [
      { id: "multnomah", name: "Multnomah County (Portland)" },
      { id: "washington_or", name: "Washington County" },
      { id: "clackamas", name: "Clackamas County" }
    ]
  },
  {
    id: "OK",
    name: "Oklahoma (OK)",
    cities: [
      { id: "oklahoma_county", name: "Oklahoma County" },
      { id: "tulsa", name: "Tulsa County" },
      { id: "cleveland_ok", name: "Cleveland County" }
    ]
  },
  {
    id: "CT",
    name: "Connecticut (CT)",
    cities: [
      { id: "fairfield", name: "Fairfield County" },
      { id: "hartford", name: "Hartford County" },
      { id: "new_haven", name: "New Haven County" }
    ]
  },
  {
    id: "UT",
    name: "Utah (UT)",
    cities: [
      { id: "salt_lake", name: "Salt Lake County" },
      { id: "utah_county", name: "Utah County (Provo)" },
      { id: "davis_ut", name: "Davis County" }
    ]
  },
  {
    id: "IA",
    name: "Iowa (IA)",
    cities: [
      { id: "polk_ia", name: "Polk County (Des Moines)" },
      { id: "linn", name: "Linn County" },
      { id: "scott_ia", name: "Scott County" }
    ]
  },
  {
    id: "NV",
    name: "Nevada (NV)",
    cities: [
      { id: "clark_nv", name: "Clark County (Las Vegas)" },
      { id: "washoe", name: "Washoe County (Reno)" }
    ]
  },
  {
    id: "AR",
    name: "Arkansas (AR)",
    cities: [
      { id: "pulaski", name: "Pulaski County (Little Rock)" },
      { id: "benton_ar", name: "Benton County" },
      { id: "washington_ar_state", name: "Washington County" }
    ]
  },
  {
    id: "MS",
    name: "Mississippi (MS)",
    cities: [
      { id: "hinds", name: "Hinds County (Jackson)" },
      { id: "harrison_ms", name: "Harrison County" },
      { id: "desoto", name: "DeSoto County" }
    ]
  },
  {
    id: "KS",
    name: "Kansas (KS)",
    cities: [
      { id: "johnson_ks", name: "Johnson County" },
      { id: "sedgwick", name: "Sedgwick County (Wichita)" },
      { id: "shawnee", name: "Shawnee County" }
    ]
  },
  {
    id: "NM",
    name: "New Mexico (NM)",
    cities: [
      { id: "bernalillo", name: "Bernalillo County (Albuquerque)" },
      { id: "doña_ana", name: "Doña Ana County" },
      { id: "santa_fe", name: "Santa Fe County" }
    ]
  },
  {
    id: "NE",
    name: "Nebraska (NE)",
    cities: [
      { id: "douglas_ne", name: "Douglas County (Omaha)" },
      { id: "lancaster", name: "Lancaster County (Lincoln)" }
    ]
  },
  {
    id: "ID",
    name: "Idaho (ID)",
    cities: [
      { id: "ada", name: "Ada County (Boise)" },
      { id: "canyon", name: "Canyon County" },
      { id: "kootenai", name: "Kootenai County" }
    ]
  },
  {
    id: "WV",
    name: "West Virginia (WV)",
    cities: [
      { id: "kanawha", name: "Kanawha County (Charleston)" },
      { id: "berkeley_wv", name: "Berkeley County" }
    ]
  },
  {
    id: "HI",
    name: "Hawaii (HI)",
    cities: [
      { id: "honolulu", name: "Honolulu County" },
      { id: "hawaii_county", name: "Hawaii County" }
    ]
  },
  {
    id: "NH",
    name: "New Hampshire (NH)",
    cities: [
      { id: "hillsborough_nh", name: "Hillsborough County" },
      { id: "rockingham", name: "Rockingham County" }
    ]
  },
  {
    id: "ME",
    name: "Maine (ME)",
    cities: [
      { id: "cumberland_me", name: "Cumberland County (Portland)" },
      { id: "york_me", name: "York County" }
    ]
  },
  {
    id: "RI",
    name: "Rhode Island (RI)",
    cities: [
      { id: "providence", name: "Providence County" },
      { id: "kent_ri", name: "Kent County" }
    ]
  },
  {
    id: "MT",
    name: "Montana (MT)",
    cities: [
      { id: "yellowstone", name: "Yellowstone County (Billings)" },
      { id: "missoula", name: "Missoula County" }
    ]
  },
  {
    id: "DE",
    name: "Delaware (DE)",
    cities: [
      { id: "new_castle", name: "New Castle County" },
      { id: "sussex_de", name: "Sussex County" }
    ]
  },
  {
    id: "SD",
    name: "South Dakota (SD)",
    cities: [
      { id: "minnehaha", name: "Minnehaha County (Sioux Falls)" },
      { id: "pennington", name: "Pennington County" }
    ]
  },
  {
    id: "ND",
    name: "North Dakota (ND)",
    cities: [
      { id: "cass_nd", name: "Cass County (Fargo)" },
      { id: "burleigh", name: "Burleigh County" }
    ]
  },
  {
    id: "AK",
    name: "Alaska (AK)",
    cities: [
      { id: "anchorage", name: "Anchorage Municipality" },
      { id: "fairbanks_star", name: "Fairbanks North Star Borough" }
    ]
  },
  {
    id: "VT",
    name: "Vermont (VT)",
    cities: [
      { id: "chittenden", name: "Chittenden County (Burlington)" },
      { id: "rutland", name: "Rutland County" }
    ]
  },
  {
    id: "WY",
    name: "Wyoming (WY)",
    cities: [
      { id: "laramie", name: "Laramie County (Cheyenne)" },
      { id: "natrona", name: "Natrona County" }
    ]
  }
];