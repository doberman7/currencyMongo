import { SecurityScanOutlined } from '@ant-design/icons/lib/icons';
import { Form, Input, Button, message, Alert } from 'antd';
import { Typography } from 'antd';
import {useEffect,useState} from 'react'
function Formulario() {
  let multiplicacion = 1
  const [error,setError] = useState(null);
  const [resultado,setResultado]=useState(false)
  const [dolares,setDolares]=useState(false)
  const { Title,Text } = Typography;

  useEffect(()=>{    
      setError(false)    
  },[error])

  const onSubmit = async (values)=> {    
    let send = true
    let cantidad = values.cantidad
    // console.log(JSON.stringify(values,null,4))
    Object.entries(values).map((val)=>{
      let valor = Number(val[1])
      if(typeof valor !== 'number' ||
        Number.isNaN(valor)
      )  {
          setError('ingresa sólo números');
          message.warning('usa solo numeros')
          setResultado(null)
          setDolares(null)
          send = false
         }
        }
      )
      if(cantidad==0){
          setError('ingresa num distinto de 0');
          message.warning('ingresa num distinto de 0')        
          send = false
          setResultado(null)
          setDolares(null)
      };
      if(send && cantidad!=0){
        try{
          message.success(`enviado ${cantidad}`)  
          // console.log(process.env.NEXT_PUBLIC_VERCEL_ENV)
          let myHeaders = new Headers();
          myHeaders.append("apikey", process.env.NEXT_PUBLIC_VERCEL_ENV);

          let requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
          };

          let currency = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=mxn&from=usd&amount=${cantidad}`, requestOptions)
          currency = await currency.json();
          console.log(currency)
          // multiplicacion = currency.quotes.USDMXN*cantidad
          // multiplicacion=Math.round((multiplicacion+Number.EPSILON)  *100)/100
          setResultado(currency.result)  
          setDolares(cantidad)       
          setError(null)
        }catch(e){
          console.log(e)
          message.error(' valio verg ')
        }
      }    
  };


  const onFinishFailed = (errorInfo) => {
    console.log('ERROR: ', errorInfo);
  };
 
  return (
      <>        
        <p>{error && <Alert message={error} type='error'/>}</p>       
        <p >{dolares!=0 && resultado!=0 && resultado && <Alert message={`${dolares}$USD `} type='warning'/>}</p>
        <p>{dolares!=0 && resultado!=0 && resultado &&     <Text default>equivale a </Text>
}</p>
        <p >{dolares!=0 && resultado!=0 && resultado && <Alert message={`${resultado}$MXN `} type='success'/>}</p>
        <p>{resultado==false && <Title level={5}>Ingresa USD</Title>}</p>
        <Form
        name="basic"
        labelCol={{
          // span: 8,
        }}
        wrapperCol={{
          // span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        
      >


        <Form.Item
          label="cantidad"
          name="cantidad"
          rules={[
            {
              required: true,
              message: 'ingresa cantidad',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            // offset: 8,
            // span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
          <SecurityScanOutlined />
            Submit
          </Button>
        </Form.Item>
        </Form>

      </>
    )
  }

  export default Formulario;