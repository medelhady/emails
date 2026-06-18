export interface CityInfo {
  id: string;
  name: string;
}

export interface USState {
  id: string;
  name: string;
  cities: CityInfo[];
}

export const usStates: USState[] = [
  {
    id: "AL", name: "Alabama",
    cities: [
      { id: "al-1", name: "Jefferson County" }, { id: "al-2", name: "Mobile County" },
      { id: "al-3", name: "Madison County" }, { id: "al-4", name: "Baldwin County" },
      { id: "al-5", name: "Montgomery County" }, { id: "al-6", name: "Shelby County" },
      { id: "al-7", name: "Tuscaloosa County" }, { id: "al-8", name: "Lee County" },
      { id: "al-9", name: "Morgan County" }, { id: "al-10", name: "Calhoun County" }
    ]
  },
  {
    id: "AK", name: "Alaska",
    cities: [
      { id: "ak-1", name: "Anchorage Borough" }, { id: "ak-2", name: "Matanuska-Susitna Borough" },
      { id: "ak-3", name: "Fairbanks North Star Borough" }, { id: "ak-4", name: "Kenai Peninsula Borough" },
      { id: "ak-5", name: "Juneau Borough" }, { id: "ak-6", name: "Bethel Census Area" },
      { id: "ak-7", name: "Ketchikan Gateway Borough" }, { id: "ak-8", name: "Kodiak Island Borough" },
      { id: "ak-9", name: "North Slope Borough" }, { id: "ak-10", name: "Nome Census Area" }
    ]
  },
  {
    id: "AZ", name: "Arizona",
    cities: [
      { id: "az-1", name: "Maricopa County" }, { id: "az-2", name: "Pima County" },
      { id: "az-3", name: "Pinal County" }, { id: "az-4", name: "Yavapai County" },
      { id: "az-5", name: "Yuma County" }, { id: "az-6", name: "Mohave County" },
      { id: "az-7", name: "Coconino County" }, { id: "az-8", name: "Cochise County" },
      { id: "az-9", name: "Navajo County" }, { id: "az-10", name: "Apache County" }
    ]
  },
  {
    id: "AR", name: "Arkansas",
    cities: [
      { id: "ar-1", name: "Pulaski County" }, { id: "ar-2", name: "Benton County" },
      { id: "ar-3", name: "Washington County" }, { id: "ar-4", name: "Sebastian County" },
      { id: "ar-5", name: "Craighead County" }, { id: "ar-6", name: "Faulkner County" },
      { id: "ar-7", name: "Saline County" }, { id: "ar-8", name: "Garland County" },
      { id: "ar-9", name: "White County" }, { id: "ar-10", name: "Jefferson County" }
    ]
  },
  {
    id: "CA", name: "California",
    cities: [
      { id: "ca-1", name: "Los Angeles County" }, { id: "ca-2", name: "San Diego County" },
      { id: "ca-3", name: "Orange County" }, { id: "ca-4", name: "Riverside County" },
      { id: "ca-5", name: "San Bernardino County" }, { id: "ca-6", name: "Santa Clara County" },
      { id: "ca-7", name: "Alameda County" }, { id: "ca-8", name: "Sacramento County" },
      { id: "ca-9", name: "Contra Costa County" }, { id: "ca-10", name: "Fresno County" }
    ]
  },
  {
    id: "CO", name: "Colorado",
    cities: [
      { id: "co-1", name: "El Paso County" }, { id: "co-2", name: "Denver County" },
      { id: "co-3", name: "Arapahoe County" }, { id: "co-4", name: "Jefferson County" },
      { id: "co-5", name: "Adams County" }, { id: "co-6", name: "Larimer County" },
      { id: "co-7", name: "Boulder County" }, { id: "co-8", name: "Weld County" },
      { id: "co-9", name: "Douglas County" }, { id: "co-10", name: "Pueblo County" }
    ]
  },
  {
    id: "CT", name: "Connecticut",
    cities: [
      { id: "ct-1", name: "Fairfield County" }, { id: "ct-2", name: "Hartford County" },
      { id: "ct-3", name: "New Haven County" }, { id: "ct-4", name: "New London County" },
      { id: "ct-5", name: "Litchfield County" }, { id: "ct-6", name: "Middlesex County" },
      { id: "ct-7", name: "Tolland County" }, { id: "ct-8", name: "Windham County" },
      { id: "ct-9", name: "Waterbury Area" }, { id: "ct-10", name: "Danbury Area" }
    ]
  },
  {
    id: "DE", name: "Delaware",
    cities: [
      { id: "de-1", name: "New Castle County" }, { id: "de-2", name: "Sussex County" },
      { id: "de-3", name: "Kent County" }, { id: "de-4", name: "Wilmington Area" },
      { id: "de-5", name: "Dover Area" }, { id: "de-6", name: "Newark Area" },
      { id: "de-7", name: "Middletown Area" }, { id: "de-8", name: "Smyrna Area" },
      { id: "de-9", name: "Milford Area" }, { id: "de-10", name: "Seaford Area" }
    ]
  },
  {
    id: "FL", name: "Florida",
    cities: [
      { id: "fl-1", name: "Miami-Dade County" }, { id: "fl-2", name: "Broward County" },
      { id: "fl-3", name: "Palm Beach County" }, { id: "fl-4", name: "Hillsborough County" },
      { id: "fl-5", name: "Orange County" }, { id: "fl-6", name: "Pinellas County" },
      { id: "fl-7", name: "Duval County" }, { id: "fl-8", name: "Lee County" },
      { id: "fl-9", name: "Polk County" }, { id: "fl-10", name: "Brevard County" }
    ]
  },
  {
    id: "GA", name: "Georgia",
    cities: [
      { id: "ga-1", name: "Fulton County" }, { id: "ga-2", name: "Gwinnett County" },
      { id: "ga-3", name: "Cobb County" }, { id: "ga-4", name: "DeKalb County" },
      { id: "ga-5", name: "Chatham County" }, { id: "ga-6", name: "Cherokee County" },
      { id: "ga-7", name: "Forsyth County" }, { id: "ga-8", name: "Henry County" },
      { id: "ga-9", name: "Richmond County" }, { id: "ga-10", name: "Muscogee County" }
    ]
  },
  {
    id: "HI", name: "Hawaii",
    cities: [
      { id: "hi-1", name: "Honolulu County" }, { id: "hi-2", name: "Hawaii County" },
      { id: "hi-3", name: "Maui County" }, { id: "hi-4", name: "Kauai County" },
      { id: "hi-5", name: "Kalawao County" }, { id: "hi-6", name: "Hilo Area" },
      { id: "hi-7", name: "Kailua Area" }, { id: "hi-8", name: "Kaneohe Area" },
      { id: "hi-9", name: "Waipahu Area" }, { id: "hi-10", name: "Kahului Area" }
    ]
  },
  {
    id: "ID", name: "Idaho",
    cities: [
      { id: "id-1", name: "Ada County" }, { id: "id-2", name: "Canyon County" },
      { id: "id-3", name: "Kootenai County" }, { id: "id-4", name: "Bonneville County" },
      { id: "id-5", name: "Bannock County" }, { id: "id-6", name: "Twin Falls County" },
      { id: "id-7", name: "Bingham County" }, { id: "id-8", name: "Bonner County" },
      { id: "id-9", name: "Nephi County" }, { id: "id-10", name: "Madison County" }
    ]
  },
  {
    id: "IL", name: "Illinois",
    cities: [
      { id: "il-1", name: "Cook County" }, { id: "il-2", name: "DuPage County" },
      { id: "il-3", name: "Lake County" }, { id: "il-4", name: "Will County" },
      { id: "il-5", name: "Kane County" }, { id: "il-6", name: "McHenry County" },
      { id: "il-7", name: "Winnebago County" }, { id: "il-8", name: "St. Clair County" },
      { id: "il-9", name: "Madison County" }, { id: "il-10", name: "Champaign County" }
    ]
  },
  {
    id: "IN", name: "Indiana",
    cities: [
      { id: "in-1", name: "Marion County" }, { id: "in-2", name: "Lake County" },
      { id: "in-3", name: "Allen County" }, { id: "in-4", name: "Hamilton County" },
      { id: "in-5", name: "St. Joseph County" }, { id: "in-6", name: "Elkhart County" },
      { id: "in-7", name: "Tippecanoe County" }, { id: "in-8", name: "Vanderburgh County" },
      { id: "in-9", name: "Porter County" }, { id: "in-10", name: "Hendricks County" }
    ]
  },
  {
    id: "IA", name: "Iowa",
    cities: [
      { id: "ia-1", name: "Polk County" }, { id: "ia-2", name: "Linn County" },
      { id: "ia-3", name: "Scott County" }, { id: "ia-4", name: "Johnson County" },
      { id: "ia-5", name: "Black Hawk County" }, { id: "ia-6", name: "Woodbury County" },
      { id: "ia-7", name: "Dubuque County" }, { id: "ia-8", name: "Story County" },
      { id: "ia-9", name: "Dallas County" }, { id: "ia-10", name: "Pottawattamie County" }
    ]
  },
  {
    id: "KS", name: "Kansas",
    cities: [
      { id: "ks-1", name: "Johnson County" }, { id: "ks-2", name: "Sedgwick County" },
      { id: "ks-3", name: "Shawnee County" }, { id: "ks-4", name: "Wyandotte County" },
      { id: "ks-5", name: "Douglas County" }, { id: "ks-6", name: "Leavenworth County" },
      { id: "ks-7", name: "Riley County" }, { id: "ks-8", name: "Butler County" },
      { id: "ks-9", name: "Reno County" }, { id: "ks-10", name: "Saline County" }
    ]
  },
  {
    id: "KY", name: "Kentucky",
    cities: [
      { id: "ky-1", name: "Jefferson County" }, { id: "ky-2", name: "Fayette County" },
      { id: "ky-3", name: "Kenton County" }, { id: "ky-4", name: "Boone County" },
      { id: "ky-5", name: "Warren County" }, { id: "ky-6", name: "Hardin County" },
      { id: "ky-7", name: "Davie County" }, { id: "ky-8", name: "Campbell County" },
      { id: "ky-9", name: "Madison County" }, { id: "ky-10", name: "Bullitt County" }
    ]
  },
  {
    id: "LA", name: "Louisiana",
    cities: [
      { id: "la-1", name: "East Baton Rouge Parish" }, { id: "la-2", name: "Jefferson Parish" },
      { id: "la-3", name: "Orleans Parish" }, { id: "la-4", name: "Caddo Parish" },
      { id: "la-5", name: "St. Tammany Parish" }, { id: "la-6", name: "Lafayette Parish" },
      { id: "la-7", name: "Ouachita Parish" }, { id: "la-8", name: "Rapides Parish" },
      { id: "la-9", name: "Calcasieu Parish" }, { id: "la-10", name: "Livingston Parish" }
    ]
  },
  {
    id: "ME", name: "Maine",
    cities: [
      { id: "me-1", name: "Cumberland County" }, { id: "me-2", name: "York County" },
      { id: "me-3", name: "Penobscot County" }, { id: "me-4", name: "Kennebec County" },
      { id: "me-5", name: "Androscoggin County" }, { id: "me-6", name: "Aroostook County" },
      { id: "me-7", name: "Oxford County" }, { id: "me-8", name: "Hancock County" },
      { id: "me-9", name: "Somerset County" }, { id: "me-10", name: "Knox County" }
    ]
  },
  {
    id: "MD", name: "Maryland",
    cities: [
      { id: "md-1", name: "Montgomery County" }, { id: "md-2", name: "Prince George's County" },
      { id: "md-3", name: "Baltimore County" }, { id: "md-4", name: "Anne Arundel County" },
      { id: "md-5", name: "Baltimore City" }, { id: "md-6", name: "Howard County" },
      { id: "md-7", name: "Harford County" }, { id: "md-8", name: "Frederick County" },
      { id: "md-9", name: "Charles County" }, { id: "md-10", name: "Carroll County" }
    ]
  },
  {
    id: "MA", name: "Massachusetts",
    cities: [
      { id: "ma-1", name: "Middlesex County" }, { id: "ma-2", name: "Worcester County" },
      { id: "ma-3", name: "Essex County" }, { id: "ma-4", name: "Suffolk County" },
      { id: "ma-5", name: "Norfolk County" }, { id: "ma-6", name: "Bristol County" },
      { id: "ma-7", name: "Plymouth County" }, { id: "ma-8", name: "Hampden County" },
      { id: "ma-9", name: "Barnstable County" }, { id: "ma-10", name: "Hampshire County" }
    ]
  },
  {
    id: "MI", name: "Michigan",
    cities: [
      { id: "mi-1", name: "Wayne County" }, { id: "mi-2", name: "Oakland County" },
      { id: "mi-3", name: "Macomb County" }, { id: "mi-4", name: "Kent County" },
      { id: "mi-5", name: "Genesee County" }, { id: "mi-6", name: "Washtenaw County" },
      { id: "mi-7", name: "Ottawa County" }, { id: "mi-8", name: "Ingham County" },
      { id: "mi-9", name: "Kalamazoo County" }, { id: "mi-10", name: "Livingston County" }
    ]
  },
  {
    id: "MN", name: "Minnesota",
    cities: [
      { id: "mn-1", name: "Hennepin County" }, { id: "mn-2", name: "Ramsey County" },
      { id: "mn-3", name: "Dakota County" }, { id: "mn-4", name: "Anoka County" },
      { id: "mn-5", name: "Washington County" }, { id: "mn-6", name: "St. Louis County" },
      { id: "mn-7", name: "Stearns County" }, { id: "mn-8", name: "Olmsted County" },
      { id: "mn-9", name: "Scott County" }, { id: "mn-10", name: "Wright County" }
    ]
  },
  {
    id: "MS", name: "Mississippi",
    cities: [
      { id: "ms-1", name: "Hinds County" }, { id: "ms-2", name: "Harrison County" },
      { id: "ms-3", name: "DeSoto County" }, { id: "ms-4", name: "Jackson County" },
      { id: "ms-5", name: "Rankin County" }, { id: "ms-6", name: "Madison County" },
      { id: "ms-7", name: "Lee County" }, { id: "ms-8", name: "Lauderdale County" },
      { id: "ms-9", name: "Forrest County" }, { id: "ms-10", name: "Jones County" }
    ]
  },
  {
    id: "MO", name: "Missouri",
    cities: [
      { id: "mo-1", name: "St. Louis County" }, { id: "mo-2", name: "Jackson County" },
      { id: "mo-3", name: "St. Charles County" }, { id: "mo-4", name: "Greene County" },
      { id: "mo-5", name: "Clay County" }, { id: "mo-6", name: "Jefferson County" },
      { id: "mo-7", name: "Boone County" }, { id: "mo-8", name: "Jasper County" },
      { id: "mo-9", name: "Franklin County" }, { id: "mo-10", name: "Cass County" }
    ]
  },
  {
    id: "MT", name: "Montana",
    cities: [
      { id: "mt-1", name: "Yellowstone County" }, { id: "mt-2", name: "Missoula County" },
      { id: "mt-3", name: "Gallatin County" }, { id: "mt-4", name: "Flathead County" },
      { id: "mt-5", name: "Cascade County" }, { id: "mt-6", name: "Lewis and Clark County" },
      { id: "mt-7", name: "Ravalli County" }, { id: "mt-8", name: "Silver Bow County" },
      { id: "mt-9", name: "Lake County" }, { id: "mt-10", name: "Lincoln County" }
    ]
  },
  {
    id: "NE", name: "Nebraska",
    cities: [
      { id: "ne-1", name: "Douglas County" }, { id: "ne-2", name: "Lancaster County" },
      { id: "ne-3", name: "Sarpy County" }, { id: "ne-4", name: "Hall County" },
      { id: "ne-5", name: "Buffalo County" }, { id: "ne-6", name: "Scotts Bluff County" },
      { id: "ne-7", name: "Dodge County" }, { id: "ne-8", name: "Lincoln County" },
      { id: "ne-9", name: "Madison County" }, { id: "ne-10", name: "Platte County" }
    ]
  },
  {
    id: "NV", name: "Nevada",
    cities: [
      { id: "nv-1", name: "Clark County" }, { id: "nv-2", name: "Washoe County" },
      { id: "nv-3", name: "Lyon County" }, { id: "nv-4", name: "Elko County" },
      { id: "nv-5", name: "Douglas County" }, { id: "nv-6", name: "Carson City" },
      { id: "nv-7", name: "Nye County" }, { id: "nv-8", name: "Churchill County" },
      { id: "nv-9", name: "Humboldt County" }, { id: "nv-10", name: "White Pine County" }
    ]
  },
  {
    id: "NH", name: "New Hampshire",
    cities: [
      { id: "nh-1", name: "Hillsborough County" }, { id: "nh-2", name: "Rockingham County" },
      { id: "nh-3", name: "Merrimack County" }, { id: "nh-4", name: "Strafford County" },
      { id: "nh-5", name: "Grafton County" }, { id: "nh-6", name: "Cheshire County" },
      { id: "nh-7", name: "Belknap County" }, { id: "nh-8", name: "Carroll County" },
      { id: "nh-9", name: "Sullivan County" }, { id: "nh-10", name: "Coos County" }
    ]
  },
  {
    id: "NJ", name: "New Jersey",
    cities: [
      { id: "nj-1", name: "Bergen County" }, { id: "nj-2", name: "Middlesex County" },
      { id: "nj-3", name: "Essex County" }, { id: "nj-4", name: "Hudson County" },
      { id: "nj-5", name: "Monmouth County" }, { id: "nj-6", name: "Ocean County" },
      { id: "nj-7", name: "Union County" }, { id: "nj-8", name: "Camden County" },
      { id: "nj-9", name: "Passaic County" }, { id: "nj-10", name: "Morris County" }
    ]
  },
  {
    id: "NM", name: "New Mexico",
    cities: [
      { id: "nm-1", name: "Bernalillo County" }, { id: "nm-2", name: "Doña Ana County" },
      { id: "nm-3", name: "Santa Fe County" }, { id: "nm-4", name: "Sandoval County" },
      { id: "nm-5", name: "San Juan County" }, { id: "nm-6", name: "Valencia County" },
      { id: "nm-7", name: "Chaves County" }, { id: "nm-8", name: "Eddy County" },
      { id: "nm-9", name: "Lea County" }, { id: "nm-10", name: "Curry County" }
    ]
  },
  {
    id: "NY", name: "New York",
    cities: [
      { id: "ny-1", name: "Kings County (Brooklyn)" }, { id: "ny-2", name: "Queens County" },
      { id: "ny-3", name: "New York County (Manhattan)" }, { id: "ny-4", name: "Suffolk County" },
      { id: "ny-5", name: "Nassau County" }, { id: "ny-6", name: "Bronx County" },
      { id: "ny-7", name: "Erie County" }, { id: "ny-8", name: "Monroe County" },
      { id: "ny-9", name: "Westchester County" }, { id: "ny-10", name: "Richmond County" }
    ]
  },
  {
    id: "NC", name: "North Carolina",
    cities: [
      { id: "nc-1", name: "Wake County" }, { id: "nc-2", name: "Mecklenburg County" },
      { id: "nc-3", name: "Guilford County" }, { id: "nc-4", name: "Forsyth County" },
      { id: "nc-5", name: "Cumberland County" }, { id: "nc-6", name: "Durham County" },
      { id: "nc-7", name: "Buncombe County" }, { id: "nc-8", name: "Union County" },
      { id: "nc-9", name: "New Hanover County" }, { id: "nc-10", name: "Gaston County" }
    ]
  },
  {
    id: "ND", name: "North Dakota",
    cities: [
      { id: "nd-1", name: "Cass County" }, { id: "nd-2", name: "Burleigh County" },
      { id: "nd-3", name: "Grand Forks County" }, { id: "nd-4", name: "Ward County" },
      { id: "nd-5", name: "Williams County" }, { id: "nd-6", name: "Stark County" },
      { id: "nd-7", name: "Morton County" }, { id: "nd-8", name: "Stutsman County" },
      { id: "nd-9", name: "Richland County" }, { id: "nd-10", name: "Rolette County" }
    ]
  },
  {
    id: "OH", name: "Ohio",
    cities: [
      { id: "oh-1", name: "Franklin County" }, { id: "oh-2", name: "Cuyahoga County" },
      { id: "oh-3", name: "Hamilton County" }, { id: "oh-4", name: "Summit County" },
      { id: "oh-5", name: "Montgomery County" }, { id: "oh-6", name: "Lucas County" },
      { id: "oh-7", name: "Butler County" }, { id: "oh-8", name: "Stark County" },
      { id: "oh-9", name: "Lorain County" }, { id: "oh-10", name: "Warren County" }
    ]
  },
  {
    id: "OK", name: "Oklahoma",
    cities: [
      { id: "ok-1", name: "Oklahoma County" }, { id: "ok-2", name: "Tulsa County" },
      { id: "ok-3", name: "Cleveland County" }, { id: "ok-4", name: "Comanche County" },
      { id: "ok-5", name: "Canadian County" }, { id: "ok-6", name: "Rogers County" },
      { id: "ok-7", name: "Payne County" }, { id: "ok-8", name: "Wagoner County" },
      { id: "ok-9", name: "Muskogee County" }, { id: "ok-10", name: "Creek County" }
    ]
  },
  {
    id: "OR", name: "Oregon",
    cities: [
      { id: "or-1", name: "Multnomah County" }, { id: "or-2", name: "Washington County" },
      { id: "or-3", name: "Clackamas County" }, { id: "or-4", name: "Lane County" },
      { id: "or-5", name: "Marion County" }, { id: "or-6", name: "Jackson County" },
      { id: "or-7", name: "Deschutes County" }, { id: "or-8", name: "Linn County" },
      { id: "or-9", name: "Douglas County" }, { id: "or-10", name: "Benton County" }
    ]
  },
  {
    id: "PA", name: "Pennsylvania",
    cities: [
      { id: "pa-1", name: "Philadelphia County" }, { id: "pa-2", name: "Allegheny County" },
      { id: "pa-3", name: "Montgomery County" }, { id: "pa-4", name: "Bucks County" },
      { id: "pa-5", name: "Delaware County" }, { id: "pa-6", name: "Lancaster County" },
      { id: "pa-7", name: "Chester County" }, { id: "pa-8", name: "York County" },
      { id: "pa-9", name: "Berks County" }, { id: "pa-10", name: "Lehigh County" }
    ]
  },
  {
    id: "RI", name: "Rhode Island",
    cities: [
      { id: "ri-1", name: "Providence County" }, { id: "ri-2", name: "Kent County" },
      { id: "ri-3", name: "Washington County" }, { id: "ri-4", name: "Newport County" },
      { id: "ri-5", name: "Bristol County" }, { id: "ri-6", name: "Warwick Area" },
      { id: "ri-7", name: "Cranston Area" }, { id: "ri-8", name: "Pawtucket Area" },
      { id: "ri-9", name: "Woonsocket Area" }, { id: "ri-10", name: "Coventry Area" }
    ]
  },
  {
    id: "SC", name: "South Carolina",
    cities: [
      { id: "sc-1", name: "Greenville County" }, { id: "sc-2", name: "Richland County" },
      { id: "sc-3", name: "Charleston County" }, { id: "sc-4", name: "Horry County" },
      { id: "sc-5", name: "Spartanburg County" }, { id: "sc-6", name: "Lexington County" },
      { id: "sc-7", name: "York County" }, { id: "sc-8", name: "Berkeley County" },
      { id: "sc-9", name: "Anderson County" }, { id: "sc-10", name: "Beaufort County" }
    ]
  },
  {
    id: "SD", name: "South Dakota",
    cities: [
      { id: "sd-1", name: "Minnehaha County" }, { id: "sd-2", name: "Pennington County" },
      { id: "sd-3", name: "Lincoln County" }, { id: "sd-4", name: "Brown County" },
      { id: "sd-5", name: "Brookings County" }, { id: "sd-6", name: "Codington County" },
      { id: "sd-7", name: "Meade County" }, { id: "sd-8", name: "Lawrence County" },
      { id: "sd-9", name: "Yankton County" }, { id: "sd-10", name: "Davison County" }
    ]
  },
  {
    id: "TN", name: "Tennessee",
    cities: [
      { id: "tn-1", name: "Shelby County" }, { id: "tn-2", name: "Davidson County" },
      { id: "tn-3", name: "Knox County" }, { id: "tn-4", name: "Hamilton County" },
      { id: "tn-5", name: "Rutherford County Tennessee" }, { id: "tn-6", name: "Williamson County" },
      { id: "tn-7", name: "Montgomery County" }, { id: "tn-8", name: "Sumner County" },
      { id: "tn-9", name: "Sullivan County" }, { id: "tn-10", name: "Wilson County" }
    ]
  },
  {
    id: "TX", name: "Texas",
    cities: [
      { id: "tx-1", name: "Harris County" }, { id: "tx-2", name: "Dallas County" },
      { id: "tx-3", name: "Tarrant County" }, { id: "tx-4", name: "Bexar County" },
      { id: "tx-5", name: "Travis County" }, { id: "tx-6", name: "Collin County" },
      { id: "tx-7", name: "Denton County" }, { id: "tx-8", name: "Fort Bend County" },
      { id: "tx-9", name: "Hidalgo County" }, { id: "tx-10", name: "El Paso County" }
    ]
  },
  {
    id: "UT", name: "Utah",
    cities: [
      { id: "ut-1", name: "Salt Lake County" }, { id: "ut-2", name: "Utah County" },
      { id: "ut-3", name: "Davis County" }, { id: "ut-4", name: "Weber County" },
      { id: "ut-5", name: "Washington County" }, { id: "ut-6", name: "Cache County" },
      { id: "ut-7", name: "Tooele County" }, { id: "ut-8", name: "Box Elder County" },
      { id: "ut-9", name: "Iron County" }, { id: "ut-10", name: "Summit County" }
    ]
  },
  {
    id: "VT", name: "Vermont",
    cities: [
      { id: "vt-1", name: "Chittenden County" }, { id: "vt-2", name: "Rutland County" },
      { id: "vt-3", name: "Washington County" }, { id: "vt-4", name: "Windsor County" },
      { id: "vt-5", name: "Franklin County" }, { id: "vt-6", name: "Windham County" },
      { id: "vt-7", name: "Bennington County" }, { id: "vt-8", name: "Caledonia County" },
      { id: "vt-9", name: "Orange County" }, { id: "vt-10", name: "Orleans County" }
    ]
  },
  {
    id: "VA", name: "Virginia",
    cities: [
      { id: "va-1", name: "Fairfax County" }, { id: "va-2", name: "Prince William County" },
      { id: "va-3", name: "Virginia Beach City" }, { id: "va-4", name: "Loudoun County" },
      { id: "va-5", name: "Chesterfield County" }, { id: "va-6", name: "Henrico County" },
      { id: "va-7", name: "Norfolk City" }, { id: "va-8", name: "Chesapeake City" },
      { id: "va-9", name: "Richmond City" }, { id: "va-10", name: "Arlington County" }
    ]
  },
  {
    id: "WA", name: "Washington",
    cities: [
      { id: "wa-1", name: "King County" }, { id: "wa-2", name: "Pierce County" },
      { id: "wa-3", name: "Snohomish County" }, { id: "wa-4", name: "Spokane County" },
      { id: "wa-5", name: "Clark County" }, { id: "wa-6", name: "Thurston County" },
      { id: "wa-7", name: "Kitsap County" }, { id: "wa-8", name: "Yakima County" },
      { id: "wa-9", name: "Whatcom County" }, { id: "wa-10", name: "Benton County" }
    ]
  },
  {
    id: "WV", name: "West Virginia",
    cities: [
      { id: "wv-1", name: "Kanawha County" }, { id: "wv-2", name: "Berkeley County" },
      { id: "wv-3", name: "Monongalia County" }, { id: "wv-4", name: "Cabell County" },
      { id: "wv-5", name: "Wood County" }, { id: "wv-6", name: "Raleigh County" },
      { id: "wv-7", name: "Harrison County" }, { id: "wv-8", name: "Mercer County" },
      { id: "wv-9", name: "Marion County" }, { id: "wv-10", name: "Jefferson County" }
    ]
  },
  {
    id: "WI", name: "Wisconsin",
    cities: [
      { id: "wi-1", name: "Milwaukee County" }, { id: "wi-2", name: "Dane County" },
      { id: "wi-3", name: "Waukesha County" }, { id: "wi-4", name: "Brown County" },
      { id: "wi-5", name: "Racine County" }, { id: "wi-6", name: "Outagamie County" },
      { id: "wi-7", name: "Winnebago County" }, { id: "wi-8", name: "Kenosha County" },
      { id: "wi-9", name: "Rock County" }, { id: "wi-10", name: "Marathon County" }
    ]
  },
  {
    id: "WY", name: "Wyoming",
    cities: [
      { id: "wy-1", name: "Laramie County" }, { id: "wy-2", name: "Natrona County" },
      { id: "wy-3", name: "Campbell County" }, { id: "wy-4", name: "Sweetwater County" },
      { id: "wy-5", name: "Fremont County" }, { id: "wy-6", name: "Albany County" },
      { id: "wy-7", name: "Sheridan County" }, { id: "wy-8", name: "Park County" },
      { id: "wy-9", name: "Teton County" }, { id: "wy-10", name: "Uinta County" }
    ]
  }
];