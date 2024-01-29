// @ts-nocheck
export { getStaticProps } from '@/framework/shops-page.ssr';
import { useRouter } from 'next/router';
import { useSubPackages,useBasePackages,useGetUserAllPackageData } from '@/framework/subscription_package';
import NotFound from '@/components/ui/not-found';
import { Routes } from '@/config/routes';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useSettings } from '@/framework/settings';
import usePrice from '@/lib/use-price';
import CategoriesLoader from '@/components/ui/loaders/categories-loader';


const subscriptionPlan = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { packages } = useSubPackages();

    // console.log("packages+_+_+_+_+",packages)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { packagesData,isLoading } = useBasePackages();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const { allPackagesData } = useGetUserAllPackageData();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [subId,setSubId] = useState('');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [newpId,setNewpId] = useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showBtn,setShowBtn] = useState(false);

    const getData = (id,pid) => {
        setShowBtn(true);
        setSubId(id);
        setNewpId(pid);
    }

     // eslint-disable-next-line react-hooks/rules-of-hooks
 const { price: totalPrice } = usePrice({
    amount: 0,
  });
  let currency = totalPrice.replace("0.00", "");


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{

    },[packages,packagesData])

    if(isLoading && packagesData.length == 0){
        <CategoriesLoader />
      }
      
    
    if (!isLoading && (packagesData != undefined && packagesData.length == 0)) {
        // if (!isLoading && product == undefined) {
            
        return (
            router.pathname != "/products" ? 
          <div className="min-h-full px-4 pt-6 pb-8 bg-gray-100 lg:p-8">
            <NotFound text="text-no-shops" />
          </div> : <></>
        );
      }

     
    
  return (
    <>
    {
 packagesData.map((res,key)=>{
            return (
                <div key={res?._id}>
                <article className="rounded-lg bg-light" >
      <div className="flex flex-col  md:flex-row" style={{marginTop:'10px',marginBottom:'10px',padding: '15px'}}>
 
                <div  style={{marginBottom:'10px',width: isMobile ? '100%' : '65%',margin: 'auto', border:'1px solid #2FB6CC'}}>
                <section id="Large_SizePack"  style={{background:"#2FB6CC", paddingBottom: '0',padding:'10px',color:'white'}}>
                    <div className="container Small_SizePackShow" style={{
                        paddingRight: '15px',
                        paddingLeft: '15px',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                    }}>
                        <div className="row" style={{marginRight: '-15px',marginLeft: '-15px'}}>
                            <div className="col-md-9 col-sm-9 col-xs-12" style={{width: '50%'}}>
                                <div className="Large_InnerPack" style={{padding:'10px'}}>
                                    <h1><b  style={{marginTop: '8px',fontSize: '19px',overflowWrap: showBtn && newpId == res?._id ? 'break-word' : ''}}>{res.name.toUpperCase()}</b></h1>
                                    
                                </div>
                                
                               
                            </div>
                            <div style={{
                                    float: 'right',
                                    marginTop: '-45px',
                                    // width: '100%'
                                    // width: '50%'
                            }}>
                                {/* {newpId == res?._id && */}
                                        <button type="button" className="btn" 
                                                        style={{
                                                            background: 'white',
                                                            color: '#2FB6CC',
                                                            padding: '5px 19px',
                                                            borderRadius: '0',
                                                            border: '1px solid #2FB6CC',
                                                            display: showBtn && newpId == res?._id ? 'block' : 'none'
                                                        }}
                                                        onClick={()=>{
                                                            if(subId != ""){
                                                                router.push(Routes.subscriptionCheckout+'?subId='+subId)
                                                            }
                                                        }}
                                                        >Subscribe</button>
                                                        
                            </div>
                        </div>
                    </div>
                </section>
                <hr style={{ border:'1px solid #2FB6CC'}}/>
                <section id="large_Table" style={{
                        background:"white",
                        marginBottom: '0',
                        padding:'10px'
                }}>
                    <div className="container " style={{
                        paddingRight: '15px',
                        paddingLeft: '15px',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                    }}>
                        <div className="row" style={{marginRight: '-15px',marginLeft: '-15px'}}>
                            <div className="col-md-12 col-sm-12 col-xs-12" style={{width: '100%'}}>
                                <div className="table-responsive" style={{
                                    overflowX: 'auto'
                                }}>
                                    <table style={{
                                            width: '100%',
                                            maxWidth: '100%',
                                            background:"white",
                                            
                                    }}>
                                        <thead style={{
                                                display: 'table-header-group',
                                                verticalAlign: 'middle',
                                                borderColor: 'inherit',
                                                color:'black'
                                        }}>
                                            <tr>
                                                <th>Select</th>
                                                <th>File Type</th>
                                                <th>Images</th>
                                                <th>Price ({currency})</th>

                                            </tr>
                                        </thead>

                                        <tbody 
                                        style={{
                                            display: 'table-header-group',
                                            verticalAlign: 'middle',
                                            borderColor: 'inherit'
                                    }}>
                                        {
                                            packages.map((response)=>{

                                                if(response?.package_type?.name == res?.name){

                                                return (
                                                    <tr key={response?._id} className="Record_InnerPack "   style={{
                                                                display: 'table-row',
                                                                verticalAlign: 'inherit',
                                                                borderColor: 'inherit'
                                                        }}>
                                                                <td style={{textAlign: 'center',padding:'14px'}}>
                                                                    <input type="radio" id="test164,000" name="large" onChange={()=>getData(response?._id,response.package_type._id)} value={response._id}/>
                                                                    <label htmlFor="test164,000" id="test164,000"></label>
                                                                </td>
                                                                <td  style={{textAlign: 'center'}}>{response?.file_type?.name?.toUpperCase()}</td>
                                                                <td  style={{textAlign: 'center'}}>{response.qnty}</td>
                                                                <td  style={{textAlign: 'center'}}>{response.price}</td>
                                                                
                                                            </tr>
                                                );
                                            }

                                            })
                                        }
                                        
                                        
                                    </tbody></table>
                                </div>
                            </div>
                          
                        </div>
                    </div>

                </section>
            </div>
            
    </div>
    </article>
                </div>
            );
        }) 
    }
    
   
     
    </>
  )

};

export default subscriptionPlan;
