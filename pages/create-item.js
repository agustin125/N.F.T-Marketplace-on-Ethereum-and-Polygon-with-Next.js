import { useState } from 'react'
import { ethers } from 'ethers'
//+-"ipfsHttpClient" is a way for us to Interact with I.P.F.S. for Uploading and Downloading Files:_
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const IPFSclient = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreateItem() {
  //+-Array of File U.R.L.s:_
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  //+-We use this to Create and Update the File U.R.L.s:_
  async function onChange(e) {
    const file = e.target.files[0]
    try {
      //+-"IPFSclient.add(***)" Import a file or data into I.P.F.S:_
      const added = await IPFSclient.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  //+-Create a new Item and Uploads it to I.P.F.S.:_
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /*+-(1)-First, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      //+-"IPFSclient.add(***)" Import a file or data into I.P.F.S:_
      const added = await IPFSclient.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /*+-(2)-After file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  //+-Lists that Item created Above in the MarketPlace:_
  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /*+-(3)-Next, create the item */
    let NFTContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let CreateToken = await NFTContract.createToken(url)
    let tokenCreated = await CreateToken.wait()

    /**+-To get the TokenID we go to the Transaction that Happended when the Token was created, we go to the 1st Event, we go to the 3rd Argument of that Event,
     *  and we convert it in a Number Data Type:_*/
    let tokenId = tokenCreated.events[0].args[2].toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /*+-(4)-Then list the item for sale on the marketplace */
    NFTMarketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    let listingPrice = await NFTMarketContract.getListingPrice()
    listingPrice = listingPrice.toString()

    CreateToken = await NFTMarketContract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await CreateToken.wait()
    //+-We send the User back to the Main Page:_
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <image className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}