const districts = [
  {
    _id: {
      $oid: "6788ff54bd4ca187715064a8",
    },
    city_id: 52,
    city_name: "Bagerhat",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064a9",
    },
    city_id: 62,
    city_name: "Bandarban ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064aa",
    },
    city_id: 34,
    city_name: "Barguna ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064ab",
    },
    city_id: 17,
    city_name: "Barisal",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064ac",
    },
    city_id: 32,
    city_name: "B. Baria",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064ad",
    },
    city_id: 53,
    city_name: "Bhola",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064ae",
    },
    city_id: 9,
    city_name: "Bogra",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064af",
    },
    city_id: 8,
    city_name: "Chandpur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b0",
    },
    city_id: 15,
    city_name: "Chapainawabganj",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b1",
    },
    city_id: 2,
    city_name: "Chittagong",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b2",
    },
    city_id: 61,
    city_name: "Chuadanga",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b3",
    },
    city_id: 11,
    city_name: "Cox's Bazar",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b4",
    },
    city_id: 5,
    city_name: "Cumilla",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b5",
    },
    city_id: 1,
    city_name: "Dhaka",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b6",
    },
    city_id: 146,
    city_name: "Dhakaaaaaaaa",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b7",
    },
    city_id: 35,
    city_name: "Dinajpur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b8",
    },
    city_id: 18,
    city_name: "Faridpur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064b9",
    },
    city_id: 6,
    city_name: "Feni",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064ba",
    },
    city_id: 38,
    city_name: "Gaibandha",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064bb",
    },
    city_id: 22,
    city_name: "Gazipur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064bc",
    },
    city_id: 56,
    city_name: "Gopalgonj ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064bd",
    },
    city_id: 30,
    city_name: "Habiganj",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064be",
    },
    city_id: 41,
    city_name: "Jamalpur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064bf",
    },
    city_id: 19,
    city_name: "Jashore",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c0",
    },
    city_id: 27,
    city_name: "Jhalokathi",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c1",
    },
    city_id: 49,
    city_name: "Jhenidah",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c2",
    },
    city_id: 48,
    city_name: "Joypurhat",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c3",
    },
    city_id: 63,
    city_name: "Khagrachari",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c4",
    },
    city_id: 20,
    city_name: "Khulna",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c5",
    },
    city_id: 42,
    city_name: "Kishoreganj",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c6",
    },
    city_id: 55,
    city_name: "Kurigram ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c7",
    },
    city_id: 28,
    city_name: "Kushtia",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c8",
    },
    city_id: 40,
    city_name: "Lakshmipur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064c9",
    },
    city_id: 57,
    city_name: "Lalmonirhat ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064ca",
    },
    city_id: 43,
    city_name: "Madaripur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064cb",
    },
    city_id: 60,
    city_name: "Magura ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064cc",
    },
    city_id: 16,
    city_name: "Manikganj",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064cd",
    },
    city_id: 50,
    city_name: "Meherpur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064ce",
    },
    city_id: 12,
    city_name: "Moulvibazar",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064cf",
    },
    city_id: 23,
    city_name: "Munsiganj",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d0",
    },
    city_id: 26,
    city_name: "Mymensingh",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d1",
    },
    city_id: 147,
    city_name: "Nahid",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d2",
    },
    city_id: 46,
    city_name: "Naogaon",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d3",
    },
    city_id: 54,
    city_name: "Narail ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d4",
    },
    city_id: 21,
    city_name: "Narayanganj",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d5",
    },
    city_id: 47,
    city_name: "Narshingdi",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d6",
    },
    city_id: 14,
    city_name: "Natore",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d7",
    },
    city_id: 44,
    city_name: "Netrakona",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d8",
    },
    city_id: 39,
    city_name: "Nilphamari",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064d9",
    },
    city_id: 7,
    city_name: "Noakhali",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064da",
    },
    city_id: 24,
    city_name: "Pabna",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064db",
    },
    city_id: 37,
    city_name: "Panchagarh",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064dc",
    },
    city_id: 29,
    city_name: "Patuakhali",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064dd",
    },
    city_id: 31,
    city_name: "Pirojpur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064de",
    },
    city_id: 58,
    city_name: "Rajbari ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064df",
    },
    city_id: 4,
    city_name: "Rajshahi",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e0",
    },
    city_id: 59,
    city_name: "Rangamati ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e1",
    },
    city_id: 25,
    city_name: "Rangpur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e2",
    },
    city_id: 51,
    city_name: "Satkhira",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e3",
    },
    city_id: 64,
    city_name: "Shariatpur ",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e4",
    },
    city_id: 33,
    city_name: "Sherpur",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e5",
    },
    city_id: 10,
    city_name: "Sirajganj",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e6",
    },
    city_id: 45,
    city_name: "Sunamganj",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e7",
    },
    city_id: 3,
    city_name: "Sylhet",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e8",
    },
    city_id: 13,
    city_name: "Tangail",
  },
  {
    _id: {
      $oid: "6788ff54bd4ca187715064e9",
    },
    city_id: 36,
    city_name: "Thakurgaon ",
  },
];

export default districts;
