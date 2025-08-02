import accImg from '../../assets/shopping-account.jpg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Address from '@/components/shopping-view/address';
import ShoppingOrders from '@/components/shopping-view/orders';

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          width={1600}
          height={300}
          style={{ aspectRatio: '1600/300', objectFit: 'cover' }}
          loading="lazy"
          src={accImg}
          alt="Shopping Account"
          className='absolute inset-0 h-full w-full object-cover object-center'
        />
      </div>
      <div className="flex justify-center p-6">
        <div className="w-full max-w-4xl rounded-lg bg-background p-6 shadow-md">
          <Tabs defaultValue='orders' className="w-full">
            <TabsList className="flex justify-center space-x-4 border-b pb-2">
              <TabsTrigger value='orders'>
                <span className="text-sm font-medium">Orders</span>
              </TabsTrigger>
              <TabsTrigger value='address'>
                <span className="text-sm font-medium">Address</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value='orders' className="pt-4">
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <ShoppingOrders />
                </div>
              </div>
            </TabsContent>
            <TabsContent value='address' className="pt-4">
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <Address />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;