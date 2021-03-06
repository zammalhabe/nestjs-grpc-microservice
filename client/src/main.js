import $ from 'jquery'
import { NTCTable } from './assets/js/NTCTable'
import { formatPrice } from './assets/js/formatPrice'
import { NumberToWord } from './assets/js/NumberToWord'
import { tr } from './assets/js/locale/tr'
import './assets/styles/NTCUIKit.css'
import './assets/styles/style.scss'

NumberToWord.i18n.register(tr)

window.$ = window.jQuery = $
window.NumberToWord = NumberToWord
window.x = new NumberToWord(11234)
const tableHeaders = ['Urun kodu', 'Urun adi', 'Birim fiyat(TL)', 'Adet', 'Fiyat(TL)']
let products
let total
$.ajax({
  url: 'http://localhost:3000/table',
  type: 'GET',
})
  .done(data => {
    products = data.tables.map(table => {
      table.total = formatPrice(table.productPrice * table.quantity)
      table.productPrice = formatPrice(table.productPrice)
      return table
    })
    let productsTable = new NTCTable({ products }, tableHeaders)
    total = productsTable.dataSource.products
      .reduce((acc, item) => {
        acc = acc + parseFloat(item.total.replace('.', '').replace(',', '.'))
        return acc
      }, 0)
    let priceToWord = new NumberToWord(total).toWord()
    let readableNumber = `<strong>Yalnız</strong> ${priceToWord.base} lira`
    if (readableNumber.reminder) {
      readableNumber = `${readableNumber} ${readableNumber.reminder} kuruş`
    }
    let $content = $('body article')
    $content.find('section').html(productsTable.generateInnerHtmlCode())
    $content.append(`
      <section class="total">
        <h1 class="ntc-heading1">Toplam</h1>
        <div class="price">${formatPrice(total)} TL</div>
        <div class="price-to-word">${readableNumber}</div>
      </section>
    `)
  })
