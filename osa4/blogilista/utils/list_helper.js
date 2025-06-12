const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  reducer = (acc, value) => {
    return acc + value.likes
  }


  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0) / Array.length
}

const favoriteBlog = blogs => {
  let favoriteBlog

  if (blogs.length === 0) {
    return null
  }

  favoriteBlog = blogs[0]

  blogs.forEach(blog => {
    const currentLikes = blog.likes || 0
    const favoriteLikes = favoriteBlog.likes || 0

    if (currentLikes > favoriteLikes) {
      favoriteBlog = blog
    }
  })

  return favoriteBlog

}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const namesAndBlogCount = _.countBy(blogs, blog => blog.author)

  // Convert to an array with keys
  const countsArray = Object.entries(namesAndBlogCount)
    .map(([name, count]) => ({
      author: name,
      blogs: count
    }))

  // Sort by based off the second element (blog count) and reverse to get biggest first
  const sortedByCount = _.sortBy(countsArray, item => item.blogs).reverse()

  // Return the first (biggest count)
  return sortedByCount[0]
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  // First is the collection, then the function used to reduce, finally then initial accumulator
  const namesAndLikeCount = _.reduce(blogs, (totalLikes, item) => {
    // Stores the totalLikes of each item / blog in the collection totalLikes
    // If totalLikes not yet initialized for the value, starts from the likes
    totalLikes[item.author] = (totalLikes[item.author] || 0) + item.likes
    return totalLikes
  }, {})

  // Convert to array with keys
  const countsArray = Object.entries(namesAndLikeCount)
    .map(([name, count]) => ({
      author: name,
      likes: count
    }))

  // Another way to find greatest count instead of sortBy.reverse() and first index
  return _.maxBy(countsArray, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
