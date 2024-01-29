// @ts-nocheck
import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/components/layouts/layout';
import { useTranslation } from 'next-i18next';
export { getStaticProps } from '@/framework/shops-page.ssr';
import { useProductsCategory,useProducts,useProduct } from '@/framework/product';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import ShowInDetails from '../../components/products/ShowInDetails'
import { useSubPackages,useBasePackages } from '@/framework/subscription_package';
// import { Table } from "@nextui-org/react";
import { Table } from '@/components/ui/table';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import ErrorMessage from '@/components/ui/error-message';
import NotFound from '@/components/ui/not-found';

const subscriptionPlan = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { packages } = useSubPackages();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { packagesData } = useBasePackages();
    
    
  return (
    <div>
       { packagesData.map((res)=>{

            return (
                <div key={res?._id}  style={{marginBottom:'100px'}}>
                <section id="Large_SizePack" className='bg-accent-hover' style={{paddingBottom: '0',padding:'10px',color:'white'}}>
                    <div className="container Small_SizePackShow" style={{
                        paddingRight: '15px',
                        paddingLeft: '15px',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                    }}>
                        <div className="row" style={{marginRight: '-15px',marginLeft: '-15px'}}>
                            <div className="col-md-9 col-sm-9 col-xs-12" style={{width: '100%'}}>
                                <div className="Large_InnerPack" >
                                    <h1><b  style={{marginTop: '8px'}}>{res.name}</b></h1>
                                    {/* <p  style={{margin: '0 0 10px'}}>5400 X 8100 pixels at 300 dpi (18” X 27” TIFF)</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="large_Table" style={{
                        background: '#f0ffea',
                        marginBottom: '0'
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
                                    <table className="table bg-accent" style={{
                                            width: '100%',
                                            maxWidth: '100%',
                                            marginBottom: '20px',
                                            
                                    }}>
                                        <thead style={{
                                                display: 'table-header-group',
                                                verticalAlign: 'middle',
                                                borderColor: 'inherit',
                                                color:'white'
                                        }}>
                                            <tr>
                                                <th>Select</th>
                                                <th>File Type</th>
                                                <th>Images</th>
                                                {/* <th>Discount</th> */}
                                                <th>Price (Rs.)</th>
                                                {/* <th>Download Within</th> */}

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

                                                if(response.package_type.name == res.name){

                                                return (
                                                    <>
                                                    <tr className="Record_InnerPack "   style={{
                                                                display: 'table-row',
                                                                verticalAlign: 'inherit',
                                                                borderColor: 'inherit'
                                                        }}>
                                                                <td style={{textAlign: 'center',padding:'14px'}}>
                                                                    <input type="radio" id="test164,000" name="large"  />
                                                                    <label htmlFor="test164,000" id="test164,000"></label>
                                                                </td>
                                                                <td  style={{textAlign: 'center'}}>{response.qnty}</td>
                                                                <td  style={{textAlign: 'center'}}>{response.file_type.toUpperCase()}</td>
                                                                {/* <td  style={{textAlign: 'center'}}>50%</td> */}
                                                                <td  style={{textAlign: 'center'}}>{response.price}</td>
                                                                {/* <td  style={{textAlign: 'center'}}>90 days</td> */}
                                                                <td  style={{textAlign: 'center'}}>
                                                                <button type="button" className="btn" 
                                                        style={{
                                                            background: '#000',
                                                            color: '#fff',
                                                            // marginRight: '50px',
                                                            padding: '5px 25px',
                                                            borderRadius: '0',
                                                            border: '1px solid #000',
                                                        }}
                                                        >Subscribe</button>
                                                                </td>
                                                            </tr>
                                                    </>
                                                );
                                            }

                                            })
                                        }
                                        
                                        
                                    </tbody></table>
                                </div>
                            </div>
                            {/* <div className="Table_bottomText text-center">
                                <p>The <strong>downloaded images/videos</strong> can be used for <strong>Lifetime</strong>.</p>

                            </div> */}
                        </div>
                    </div>

                </section>
            </div>
            );
        })
        }
    </div>
  )
   

};
// subscriptionPlan.getLayout = getLayout;

export default subscriptionPlan;
