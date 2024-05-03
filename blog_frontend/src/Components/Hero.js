import Carousel from "react-bootstrap/Carousel";

const heroData = [
  {
    id: 1,
    image: require("../assets/images/img-hero1.jpg"),
    title: "Start writing your own blogposts",
    description:
      "As a blogger, one of the most exciting aspects is creating engaging and informative content for your audience. Whether you're sharing personal experiences, providing expert advice, or discussing current events, each blog post is an opportunity to connect with your readers. Remember to stay authentic and passionate about your topics to captivate your audience's interest.",
    link: "/create-blog",
  },
  {
    id: 2,
    image: require("../assets/images/img-hero2.jpg"),
    title: "Comment on blogposts",
    description:
      "Engaging with your audience through comments is a crucial aspect of building a community around your blog. Encourage readers to share their thoughts, ask questions, and provide feedback on your posts. Respond to comments promptly and thoughtfully to foster a sense of connection and dialogue. By actively engaging with your audience, you can create a dynamic and interactive blogging experience.",
    link: "/home",
  },
  {
    id: 3,
    image: require("../assets/images/img-hero3.jpg"),
    title: "Update your blogs",
    description:
      "Keeping your blog content fresh and up-to-date is essential for maintaining reader interest and relevance. Regularly review and update your existing blog posts to ensure accuracy, relevance, and completeness. Incorporate new information, insights, or developments to enhance the value of your content. Additionally, consider repurposing or expanding upon popular topics to provide your audience with fresh perspectives and insights. By consistently updating your blogs, you can demonstrate your expertise and commitment to delivering valuable content to your readers.",
    link: "/profile",
  },
];

function AppHero() {
  return (
    <section id="home" className="hero-block">
      <Carousel>
        {heroData.map((hero) => {
          return (
            <Carousel.Item key={hero.id}>
              <img
                className="d-block w-100"
                src={hero.image}
                alt={"slide " + hero.id}
              />
              <Carousel.Caption>
                <h2>{hero.title}</h2>
                <p>{hero.description}</p>
                <a className="btn btn-primary" href={hero.link}>
                  Learn More <i className="fas fa-chevron-right"></i>
                </a>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </section>
  );
}

export default AppHero;
