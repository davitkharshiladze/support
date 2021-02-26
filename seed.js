const mongoose = require("mongoose");
const config = require("config");
const { User } = require("./models/user");
const { Region } = require("./models/Region");
const { Building } = require("./models/building");

const data = [
  {
    name: "თბილისი",
    buildings: [
      {
        name: "თბილისის მთავარი სამმართველო (ს.ცინცაძის 6)"
      },
      {
        name: "ვაკე-საბურთალოს III სახანძრო-სამაშველო განყოფილება (წყნეთი)"
      }
    ]
  },

  {
    name: "შიდა ქართლი",
    buildings: [
      {
        name: "შიდა ქართლის მთავარი სამმართველო"
      },
      {
        name: "ხაშურის სახანძრო-სამაშველო განყოფილება"
      }
    ]
  }
];

async function seed() {
  await mongoose.connect(config.get("db"));

  // await Region.deleteMany({});
  // await Building.deleteMany({});

  // for (let region of data) {
  //   const { _id: regionId } = await new Region({ name: region.name }).save();
  //   const buildings = region.buildings.map(building => ({
  //     ...building,
  //     region: regionId
  //   }));
  //   await Building.insertMany(buildings);
  // }

  const users = [
    {
      email: "dkharshiladze@mes.gov.ge",
      password: "volvoe60wdra",
      name: "davit kharshiladze",
      role: "tech-support"
    },
    {
      email: "lkarkashadze@es.gov.ge",
      password: "12345678",
      name: "lasha karkashadze",
      role: "admin"
    }
  ];

  await User.insertMany(users);
  mongoose.disconnect();

  console.info("Done!");
}

seed();
