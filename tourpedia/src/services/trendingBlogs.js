const blogs = [
    {
        image_src: "/images/img-9.jpg",
        title: "Rafting at Kullu",
        author: "Ishrat Jahan Eliza",
        tag: "Adventure",
        path: "/",
    },
    {
        image_src: "/images/img-2.jpg",
        title: "Fagu",
        author: "Rathijit Paul",
        tag: "Luxury",
        path: "/",
    },
    {
        image_src: "/images/img-4.jpg",
        title: "Maze of fun",
        author: "Saifullah Talukder",
        tag: "Mystery",
        path: "/",
    },
    {
        image_src: "/images/img-8.jpg",
        title: "Life as a Saracen",
        author: "Mimsadi Islam Ana",
        tag: "Desert",
        path: "/",
    }
];

export function getTrendingBlogs() {
    return blogs;
}