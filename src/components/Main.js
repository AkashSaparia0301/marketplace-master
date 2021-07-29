import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const color = this.color.value
          const karat = this.karat.value
          const purity = this.purity.value
          const tola = this.tola.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.createGold(name, price, color, karat, purity,tola)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="color"
              type="text"
              ref={(input) => { this.color = input }}
              className="form-control"
              placeholder="Color"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="karat"
              type="number"
              ref={(input) => { this.karat = input }}
              className="form-control"
              placeholder="Karat"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="purity"
              type="number"
              ref={(input) => { this.purity = input }}
              className="form-control"
              placeholder="Purity (in %)"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="tola"
              type="number"
              ref={(input) => { this.tola = input }}
              className="form-control"
              placeholder="Tola"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2 bgcolor="grey">Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.Golds.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    { !product.purchased
                      ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.props.purchaseGold(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
