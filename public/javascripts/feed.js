let userInfo = {}
let filterArray = []
let filterList = document.querySelector('.filterList')

document.addEventListener('DOMContentLoaded', () => {
  const updateFeed = (userInfomation3) =>{
    axios({
      method: 'post',
      url: '/news',
      data: userInfomation3
    })
    .then((response) => {
      list.innerHTML = ''
      for (var i = 0; i < response.data.articles.length; i++) {
        let newThread = document.createElement('li')
        let newImage = document.createElement('img')
        let newDiv = document.createElement('div')
        let newHead = document.createElement('h5')
        let newText = document.createElement('p')
        let newButton = document.createElement('input')
        let newForm = document.createElement('form')
        if (response.data.articles[i].title) {
          newHead.innerHTML = response.data.articles[i].title
        } else {
          newHead.innerHTML = 'No Headline provided'
        }
        if (response.data.articles[i].author) {
          newHead.innerHTML += `, Created by: ${response.data.articles[i].author}`
        }
        if (response.data.articles[i].content) {
          newText.innerHTML = response.data.articles[i].content
        } else {
          newText.innerHTML = 'No Summary provided'
        }
        if (!response.data.articles[i].urlToImage) {
          newImage.src = 'http://i2.wp.com/www.4motiondarlington.org/wp-content/uploads/2013/06/No-image-found.jpg'
        } else {
          newImage.src = response.data.articles[i].urlToImage
        }
        if (response.data.articles[i].url) {
          newButton.type = 'submit'
          newButton.className = 'btn mb-2 btn-secondary'
          newButton.value = 'Visit Article page'
          console.log(response.data.articles[i].url)
          newForm.action = response.data.articles[i].url
        }
        newThread.className = 'media listItem my-2 rounded mx-2'
        newHead.className = 'my-2'
        newDiv.className = 'media-body'
        newImage.className = 'mx-3 my-3 rounded'
        newImage.style = 'max-height: 30%; max-width: 30%;'
        newDiv.style = 'color: white;'
        newHead.style = 'font-family: Roboto Condensed, sans-serif;'
        newText.style = 'font-family: Playfair Display, serif;'
        newThread.style = "background-color: #1F91D3"
        newDiv.appendChild(newHead)
        newDiv.appendChild(newText)
        newForm.appendChild(newButton)
        newDiv.appendChild(newForm)
        newThread.appendChild(newImage)
        newThread.appendChild(newDiv)
        list.appendChild(newThread)
        list.appendChild(document.createElement('br'))
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const addFilter = (userInfomation2) =>{
    return  axios({
      method: 'post',
      url: '/filters',
      data: userInfomation2
    })
  }

  const getUserInfo = (userInfomation) => {
    // console.log(userInfomation)
    return  axios({
      method: 'get',
      url: `/users/${userInfomation.user_id}`
    })
  }

  const checkLoggedIn = () =>{
    return axios({
      method: 'get',
      url: '/login'
    })
  }

  const getUsername = () => {
    return checkLoggedIn()
    .then(response => {
      getUserInfo(response.data)
      .then(results => {
        userInfo.user_id = results.data.user_id
        userInfo.username = results.data.username
        userInfo.email = results.data.email
        userInfo.filters = results.data.filters
        filterArray = userInfo.filters
        if (!checkLoggedIn()) {
          document.querySelector('.username1').innerHTML = 'Login'
        } else {
          document.querySelector('.username1').innerHTML = `${userInfo.username}`
        }
        if (filterArray) {
          for (var i = 0; i < filterArray.length; i++) {
            let badge = document.createElement('span')
            let button = document.createElement('span')
            let image = document.createElement('img')
            let text = document.createElement('p')
            let span = document.createElement('span')
            let filterList2 = document.querySelector('.filterList')
            text.innerHTML = filterArray[i]
            text.className = 'mb-0 mr-1'
            image.src = 'https://image.flaticon.com/icons/png/128/458/458594.png'
            image.style = 'height: 20px; width: 20px;'
            image.className = 'float-left'
            span.className = 'form-inline'
            badge.className = `badge float-left filter badge-secondary mt-2 mr-2`
            badge.style = 'font-size: 16px;'
            text.addEventListener('click', (event) => {
              userInfo.filter = event.target.innerHTML
              updateFeed(userInfo)
            })
            image.addEventListener('click', (event) => {
              console.log(event.path[1].firstElementChild.innerHTML)
            })
            span.appendChild(text)
            span.appendChild(image)
            badge.appendChild(span)
            filterList2.appendChild(badge)
            filterList2.appendChild(button)
          }
        } else {
          let filterList4 = document.querySelector('.filterList')
          let filter = document.createElement('span')
          filter.innerHTML = 'No Filters'
          filterList4.appendChild(filter)
        }
      })
    })
  }
getUsername()

const list = document.querySelector('.list')


updateFeed({
  filter: 'news'
})
// let filter = document.querySelectorAll('.filter')
// console.log(filter)
//   filter.addEventListener('click', () => {
//     console.log(event.target)
//   })
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    const userSearch = document.querySelector('.searchBar')
    if (userSearch.value === '') {
      userSearch.placeholder = 'Please enter a Filter'
    } else {
      let filterlist3 = document.querySelector('.filterList')
      list.innerHTML = ''
      filterlist3.innerHTML = ''
      userInfo.filter = userSearch.value
      checkLoggedIn()
      .then(result=>{
        if(result.data) {
          addFilter(userInfo)
          .then((response) => {
            userInfo['user_id'] = response.data.user_id
            getUsername(userInfo)
            .then(filterInfo=>{
              userInfo = filterInfo.data
            })
            updateFeed(userInfo)
          })
        } else {
          alert("please login first")
        }
      })
    }
  })
  document.querySelector('.logout').addEventListener('click', () => {
    axios.delete('/login')
    window.location.href = '/login.html'
  })
})
