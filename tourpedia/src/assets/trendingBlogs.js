const blogs = [
    {
        image_src: "https://miro.medium.com/max/6300/0*fXODQNvWaNyQyYrK",
        title: "Rafting at Kullu",
        author: "Ishrat Jahan Eliza",
        tag: "Adventure",
        path: "/",
    },
    {
        image_src: "https://images.wunderstock.com/Bird-s-Eye-View-of-Islands_L37Z1krz9EFv.jpeg",
        title: "Fagu",
        author: "Rathijit Paul",
        tag: "Luxury",
        path: "/",
    },
    {
        image_src: "https://miro.medium.com/max/7908/1*LhandHong3fZ1nAygwMPiA.jpeg",
        title: "Maze of fun",
        author: "Saifullah Talukder",
        tag: "Mystery",
        path: "/",
    },
    {
        image_src: "https://miro.medium.com/max/12506/0*aiDI0NiXsAwFLN1-",
        title: "Life as a Saracen",
        author: "Mimsadi Islam Ana",
        tag: "Desert",
        path: "/",
    }
];

export function getTrendingBlogs() {
    return blogs;
}