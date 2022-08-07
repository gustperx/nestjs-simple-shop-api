import * as bcrypt from 'bcrypt';

interface SeedProduct {
  description: string;
  images: string[];
  price: number;
  slug: string;
  tags: string[];
  title: string;
  model: string;
}

interface SeedUser {
  email: string;
  fullName: string;
  password: string;
  roles: string[];
}

interface SeedData {
  users: SeedUser[];
  products: SeedProduct[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'test1@example.com',
      fullName: 'Test One',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['user'],
    },
    {
      email: 'test2@example.com',
      fullName: 'Test Two',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['user', 'admin'],
    },
    {
      email: 'test3@example.com',
      fullName: 'Test Three',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['admin'],
    },
  ],

  products: [
    {
      description:
        'Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.',
      images: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
      price: 75,
      slug: 'mens_chill_crew_neck_sweatshirt',
      tags: ['sweatshirt'],
      title: 'Men’s Chill Crew Neck Sweatshirt',
      model: 'Model A',
    },
    {
      description:
        "The Men's Quilted Shirt Jacket features a uniquely fit, quilted design for warmth and mobility in cold weather seasons. With an overall street-smart aesthetic, the jacket features subtle silicone injected Tesla logos below the back collar and on the right sleeve, as well as custom matte metal zipper pulls. Made from 87% nylon and 13% polyurethane.",
      images: ['1740507-00-A_0_2000.jpg', '1740507-00-A_1.jpg'],
      price: 200,
      slug: 'men_quilted_shirt_jacket',
      tags: ['jacket'],
      title: "Men's Quilted Shirt Jacket",
      model: 'Model F',
    },
    {
      description:
        "Introducing the Tesla Raven Collection. The Men's Raven Lightweight Zip Up Bomber has a premium, modern silhouette made from a sustainable bamboo cotton blend for versatility in any season. The hoodie features subtle thermoplastic polyurethane Tesla logos on the left chest and below the back collar, a concealed chest pocket with custom matte zipper pulls and a french terry interior. Made from 70% bamboo and 30% cotton.",
      images: ['1740250-00-A_0_2000.jpg', '1740250-00-A_1.jpg'],
      price: 130,
      slug: 'men_raven_lightweight_zip_up_bomber_jacket',
      tags: ['shirt'],
      title: "Men's Raven Lightweight Zip Up Bomber Jacket",
      model: 'Model B',
    },

    {
      description:
        "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Men's Turbine Long Sleeve Tee features a subtle, water-based T logo on the left chest and our Tesla wordmark below the back collar. The lightweight material is double-dyed, creating a soft, casual style for ideal wear in any season. Made from 50% cotton and 50% polyester.",
      images: ['1740280-00-A_0_2000.jpg', '1740280-00-A_1.jpg'],
      price: 45,
      slug: 'men_turbine_long_sleeve_tee',
      tags: ['shirt'],
      title: "Men's Turbine Long Sleeve Tee",
      model: 'Model C',
    },
  ],
};
