import lambdeeLogo from '../assets/lambdee-logo.svg'

function logLogo(url, height = 100, text = '', fontSize = 16) {
  const styles = [
    `font-size: ${fontSize}px`,
    `padding: ${height}px`,
    `background: url(${url}) no-repeat`,
    'background-size: contain'
  ].join(';')
  console.log(`%c ${text}`, styles)
}

logLogo(lambdeeLogo, 24, ' Lambdee', 32)
