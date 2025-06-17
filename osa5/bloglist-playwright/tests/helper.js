const { create } = require("domain")

const loginUser = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create a new blog '}).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)

  await page.getByRole('button', { name: 'Create' }).click()
  
  // Wait for the blog to be shown in the page
  await page.getByText(`${title} ${author}`).waitFor()

  // Show blog details after creating
  // await page.getByRole('button', { name: 'view' }).click()
}

module.exports = { 
  loginUser,
  createBlog
}