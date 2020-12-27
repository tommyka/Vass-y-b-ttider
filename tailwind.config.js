module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.tsx',
  ],
  theme: {
    colors: {
      nav: '#3498db',
      vass: '#1abc9c',
      svg: '#2980b9',
      gray: 'gray',
      bgray: 'rgba(0,0,0,.3)',
      white: '#ffffff',
      black: '#000000',
      next: '#e67e22'
    },
    boxShadow: {
      default: '0px 0px 8px rgba(0, 0, 0, 0.3)'
    },
    extend: {
      backgroundOpacity: {
        '90': '0.90'
      }
    }
  },
  variants: {
    flexDirection: ['responsive'],
  },
  plugins: [],
}
