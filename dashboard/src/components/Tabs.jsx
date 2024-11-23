import { useEffect, useState } from 'react';
import { useStateContext } from '../context/StateContext';
import { useToastContext } from '../context/ToastContext';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from './Loader';
import ToastMessage from './ToastMessage';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('ios');
  const axiosPrivateInstance = useAxiosPrivate();
  const toast = useToastContext()
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const { loading, setLoading, getErrorDetails } = useStateContext()
  const [androidBannerAd, setAndroidBannerAd] = useState(false);
  const [iosBannerAd, setIosBannerAd] = useState(false);
  const [androidAppId, setAndroidAppId] = useState('');
  const [iosAppId, setIosAppId] = useState('')

  const getAddMob = async () => {
    try {
      const response = await axiosPrivateInstance.get("add-mob");
      if (response.data){
        const data = response.data
        setAndroidAppId(data.android_app_id)
        setAndroidBannerAd(data.show_bannar_ad_android)
        setIosBannerAd(data.show_bannar_ad_ios)
        setIosAppId(data.ios_app_id)
      }
    } catch (error) {
      //console.log(error)
    }
  };

  useEffect(() => {
  getAddMob();
}, [axiosPrivateInstance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axiosPrivateInstance.post("add-mob",
        JSON.stringify({
          ios_app_id : iosAppId,
          android_app_id : androidAppId,
          show_bannar_ad_android : androidBannerAd,
          show_bannar_ad_ios : iosBannerAd,
        })
      );
      if ( response.status==200){
        toast.open(
          <ToastMessage toast={'update'} title={"Successfully Updated"} details={"Add Mob Update Successfully"}/>
        )
      }
    } catch (error) {
      toast.open(
        <ToastMessage toast={'error'} title={"Failed!"} details={getErrorDetails(error)} />
      );
    } finally{
      setLoading(false)
    }
  };

  return (
    <div>
      {loading && <Loader/>}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" role="tablist">
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'ios' ? 'border-blue-500' : 'border-transparent'}`}
              id="ios-tab"
              onClick={() => handleTabClick('ios')}
              type="button"
              role="tab"
              aria-controls="ios"
              aria-selected={activeTab === 'ios'}
            >
              IOS
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === 'android' ? 'border-blue-500' : 'border-transparent'}`}
              id="android-tab"
              onClick={() => handleTabClick('android')}
              type="button"
              role="tab"
              aria-controls="android"
              aria-selected={activeTab === 'android'}
            >
              Android
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab !== 'ios' ? 'hidden' : ''}`} id="ios" role="tabpanel" aria-labelledby="ios-tab">
        <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="banner-ad-toggle" className="block text-sm font-medium text-gray-900 dark:text-white">Banner Ad</label>
          <button
            type="button"
            onClick={() => {
              setIosBannerAd(!iosBannerAd);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${
              iosBannerAd ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className="sr-only">Enable Banner Ad</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                iosBannerAd ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label htmlFor="android-app-id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">IOS App ID</label>
          <input
            id="android-app-id"
            type="text"
            value={iosAppId}
            onChange={(e)=>setIosAppId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Enter Android App ID"
            required
          />
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
        </div>
        <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab !== 'android' ? 'hidden' : ''}`} id="android" role="tabpanel" aria-labelledby="android-tab">
          <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="banner-ad-toggle" className="block text-sm font-medium text-gray-900 dark:text-white">Banner Ad</label>
          <button
            type="button"
            onClick={()=>setAndroidBannerAd(!androidBannerAd)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${
              androidBannerAd ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className="sr-only">Enable Banner Ad</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                androidBannerAd ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label htmlFor="android-app-id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Android App ID</label>
          <input
            id="android-app-id"
            type="text"
            value={androidAppId}
            onChange={(e)=>setAndroidAppId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Enter Android App ID"
            required
          />
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;