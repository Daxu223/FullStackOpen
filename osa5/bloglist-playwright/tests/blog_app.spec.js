const {test, expect, beforeEach, describe } = require('@playwright/test')
const { loginUser, createBlog } = require('./helper')
const { create } = require('../../bloglist-backend/models/blog')
const { execPath } = require('process')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginText = page.getByText('Log in to application')
    const loginButton = page.getByRole('button', { name: "Login" })
    
    await expect(loginText).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginUser(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async({ page }) => {
      await loginUser(page, 'mluukkai', 'einiinsalainen')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginUser(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, "Otsikko", "Matti", "http://localhost:9323")
      const blogElement = page.getByText('Otsikko Matti')

      await expect(blogElement).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, "Otsikko", "Matti", "http://localhost:9323")
      await page.getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'like' }).click()
      const likes = await page.getByText('likes')
      await expect(likes).toContainText('1')
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, "Otsikko", "Matti", "http://localhost:9323")
      await page.getByRole('button', { name: 'view' }).click()

      const blogElement = page.getByText('Otsikko Matti')
      await expect(blogElement).toBeVisible()

      /* By default, dialogs are auto-dismissed.
      *  Here we register a dialog handler before the action
      *  and to configure Playwright to accept the dialog */
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: "remove" }).click()

      await expect(blogElement).not.toBeVisible()
    })

    test('only blog owner sees delete button', async ({ page, request }) => {
      // Create user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Samu Kollin',
          username: 'daxu',
          password: 'moikka1'
        }
      })
  
      // Make a new blog with logged in user and log him out
      await createBlog(page, "Älä poista", "Matti", "http://localhost:9323")
      await page.getByRole('button', { name: "Logout" }).click()
  
      // Login with the second user
      await loginUser(page, 'daxu', 'moikka1')
      await expect(page.getByText('Samu Kollin logged in')).toBeVisible()
  
      // Playwright too fast, wait for the blogs to be fetched
      await page.getByText("Älä poista Matti").waitFor()
      await page.getByRole('button', { name: 'view' }).click()
      
      // Get the other persons blog and see if there is a delete button
      const otherPersonsBlog = page.getByRole('button', { name: 'remove' })
      await expect(otherPersonsBlog).not.toBeVisible()
    })

    test('blogs are in most liked order', async({ page }) => {
      await createBlog(page, "first blog", "Matti", "http://localhost:9323")
      await createBlog(page, "second blog", "Matti", "http://localhost:9323")
      await createBlog(page, "third blog", "Matti", "http://localhost:9323")
      
      // The blogs are inside an unnamed div, which contains .blog elements
      const blogList = page.getByTestId('blog-title-author')

      // https://ray.run/questions/how-do-i-use-playwright-s-assertion-methods-to-check-if-a-list-of-names-is-sorted-in-ascending-or-descending-order
      let expectedOrder = ['first blog Matti', 'second blog Matti', 'third blog Matti']
      await expect(blogList).toContainText(expectedOrder)

      // Show the second blog and like it
      const thirdBlogElement = await page.getByText('third blog Matti')
      
      // Find the parent div of the blog to click the button
      const blogContainer = await thirdBlogElement.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()

      // Like the blog
      await page.getByRole('button', { name: 'like' }).click()
      const likes = await page.getByText('likes')
      await expect(likes).toContainText('1')
      
      // Hide blog so that they can be compared like before
      await blogContainer.getByRole('button', { name: 'hide' }).click()

      expectedOrder = ['third blog Matti', 'first blog Matti', 'second blog Matti']
      await expect(blogList).toContainText(expectedOrder)

    })
  })
})