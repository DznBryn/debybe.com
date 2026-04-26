import { gql } from '@apollo/client';

export const GET_API_HEALTH_QUERY = gql`
  query GetApiHealth {
    health
  }
`;

export const GET_APPS_QUERY = gql`
  query GetApps {
    apps {
      id
      name
      url
    }
  }
`;

export const GET_PUBLISHED_POSTS_QUERY = gql`
  query GetPublishedPosts($limit: Int) {
    publishedPosts(limit: $limit) {
      id
      slug
      title
      excerpt
      tags
      readingMinutes
      publishedAt
      updatedAt
    }
  }
`;

export const GET_POST_BY_SLUG_QUERY = gql`
  query GetPostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      id
      slug
      title
      excerpt
      content
      tags
      readingMinutes
      publishedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_TAGS_QUERY = gql`
  query GetAllTags {
    allTags
  }
`;
