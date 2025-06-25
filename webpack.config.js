const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '',
  },
  mode: 'development',  // добавили режим разработчика
  devServer: {
    static: path.resolve(__dirname, './dist'), // путь, куда "смотрит" режим разработчика
    open: true, // сайт будет открываться сам при запуске npm run dev
    compress: true, // это ускорит загрузку в режиме разработки
    port: 8080 // порт, чтобы открывать сайт по адресу localhost:8080, но можно поменять порт
  },
  devtool:'source-map',
  module: { 
    // rules — это массив правил
    rules: [{
        test: /\.js$/, // регулярное выражение, которое ищет все js файлы
        use: 'babel-loader', // при обработке этих файлов нужно использовать babel-loader
        exclude: '/node_modules/' // исключает папку node_modules, файлы в ней обрабатывать не нужно
      },
      {
        // регулярное выражение, которое ищет все файлы с такими расширениями
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/, // применять это правило только к CSS-файлам
        use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // Если вы используете директиву @import в css-файлах необходимо передать опцию importLoaders со значением 1
            },
        },
        'postcss-loader'
       ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' // путь к файлу index.html
  }),
  new CleanWebpackPlugin(), // использовали плагин
  new MiniCssExtractPlugin(), // подключение плагина для объединения файлов
  ] 
}



// module.exports — это синтаксис экспорта в Node.js 
//  указали первое место, куда заглянет webpack, — файл index.js в папке src 
// указали, в какой файл будет собираться весь js, и дали ему имя