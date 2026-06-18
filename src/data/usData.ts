export interface CityInfo {
  id: string;
  name: string;
}

export interface StateInfo {
  id: string;
  name: string;
  cities: CityInfo[]; // المقاطعات (Counties) مرتبة حسب الكثافة السكانية
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
      { id: "sc_county", name: "Santa Clara County" }
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
      { id: "travis_county", name: "Travis County (Austin)" }
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
      { id: "orange_fl", name: "Orange County (Orlando)" }
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
      { id: "suffolk_county", name: "Suffolk County" }
    ]
  }
];