import {NextPage} from 'next';
import Image from '../components/images/image.component';
import BlogPost from '../common/interfaces/blog-post.interface';
import Layout from '../layouts/default';
import getBlogPost, {parseContent} from '../common/services/blog-post.service';
import convertToBlogDate from '../common/services/blog-date.service';
import BlogPostHeroBanner from '../components/hero-banner/blog-post-hero-banner.component';
import BlogPostAuthor from '../components/blog-post-author/blog-post-author.component';
import Content from '../components/content/content';
import SharePost from '../components/share-post/share-post';
import {NextSeo} from 'next-seo';

const BlogPostPage: NextPage<BlogPost> = (props: BlogPost) => {
  return (
    <Layout>
      <NextSeo
        title={props.title}
        description={props.description}
        twitter={{
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title: props.title,
          description: props.description,
          images: [
            {
              url: 'https:' + props.image.src + '?w=1080',
              width: 1080
            }
          ]
        }}
      />
      <div className="content-wrapper">
        <BlogPostAuthor authors={props.authors} date={props.date} readTime={props.readTime}/>
        <BlogPostHeroBanner title={props.title} subTitle={props.description}/>
      </div>
      <div className="blog-image">
        <Image altText={props.image.altText} src={props.image.src}
               dynamicImagingOptions={[{w: 4096}, {w: 2048}, {w: 1080}, {w: 414}]}/>
      </div>
      <div className="content-wrapper">
        <Content content={props.content}/>
        <SharePost twitterText={props.title}/>
      </div>
      <style jsx>{`
        .content-wrapper {
          margin: auto;
          max-width: 675px;
        }

        .blog-image :global(img) {
          object-fit: cover;
          max-height: 400px;
        }

        @media (max-width: 675px) {
          .content-wrapper {
            display: block;
            padding: 0 20px;
          }
        }
      `}</style>
    </Layout>
  );
};

BlogPostPage.getInitialProps = async ({query}) => {
  try {
    const blogPostId = query['blog-id'].toString();
    const blogPost = await getBlogPost(blogPostId);
    blogPost.content = await parseContent(blogPost.content);
    blogPost.date = convertToBlogDate(blogPost.date);
    return blogPost;
  } catch (err) {
    throw err;
  }
};

export default BlogPostPage;
