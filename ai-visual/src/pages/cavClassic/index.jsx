import { DeleteFilled } from '@ant-design/icons';
import { InputNumber, Button, Space } from 'antd'
import React, { useState, useEffect, useRef, createContext } from 'react'
import './index.css'
import CavSider from '../../component/cavSider';
import Car from '../../component/routeAndMove';
import Lane from '../../component/Lane';
import { axiosFormDataPost, axiosGet } from '../../utils/request';
import loading from '../../assets/videos/loading.mp4'
const sleep = (delay) => {
	var start = (new Date()).getTime();
	while ((new Date()).getTime() - start < delay) {
		continue;
	}
}
export const Context = createContext()

export default function CavClassic() {
	const [Ncar, setNcar] = useState([])
	const [Nlane, setNlane] = useState([])
	const [Sdistance, setSdistance] = useState(0)
	const [Speedx, setSpeedx] = useState(0)
	const [Speedy, setSpeedy] = useState(0)
	const [angle, setAngle] = useState({ x: 0, y: 0 });
	//最左边车辆的坐标
	const Leftest = 400
	//屏幕坐标
	const [scrCoor, setScrCoor] = useState([{ x: 0, y: 0 }])
	//坐标系坐标
	const [coor, setCoor] = useState([{ x: 0, y: 0 }])
	//loading
	const [Loading, setLoading] = useState(false)

	//设置阀门，只有当move为true时小车才能动
	const [move, setMove] = useState(false)
	useEffect(() => {
		if (Ncar.length > 0 && Nlane.length > 0) {
			setMove(false)
			setCoor([{ x: 0, y: 0 }])
			setScrCoor([{ x: 0, y: 0 }])
			setLoading(true)
			axiosGet('http://qgailab.com/algorithmVisualization/api/car?tableName=cavtest&polishId=true&amount=300&pieces=15').
				then(response => { setCoor(response.data.data); setLoading(false); setMove(true) })
		}
	}, [Ncar, Nlane])

	useEffect(() => {
		setAngle({ x: Speedx, y: Speedy })
	}, [Speedx, Speedy])

	return (
		<div className="cavClassic">
			<Context.Provider value={{ Ncar, Nlane }}>
				{Loading ? <div className='video'> <video src={loading} autoPlay muted={true} loop={true}></video> </div> : ''}
				<CavSider setMove={setMove} setNcar={setNcar} setNlane={setNlane} setSdistance={setSdistance} setSpeedx={setSpeedx} setSpeedy={setSpeedy} />
				<div className="cavClassic-right">
					<div className="cavClassic-right-del">
						<Button><Space>Del <DeleteFilled /></Space></Button>
					</div>
					<div className='cavClassic-right-main'>
						{Ncar.map((value, index) => (<Car index={index} move={move} setMove={setMove} scrCoor={scrCoor.length > 10 ?
							scrCoor.map((v, i) => ({ y: v.list[index].y, x: v.list[index].x === Math.min(...v.list.map((vv, ii) => (vv.x))) ? Leftest : Leftest + (v.list[index].x - Math.min(...v.list.map((vv, ii) => (vv.x)))) }))
							: ''} angle={angle} key={index} />))}
						<Lane move={move} setScrCoor={setScrCoor} coor={coor} Nlane={Nlane} />
					</div>
				</div>
			</Context.Provider>
		</div>
	)
}
