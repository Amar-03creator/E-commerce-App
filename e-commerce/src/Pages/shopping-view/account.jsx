
import accImg from '../../assets/shopping-account.jpg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Address from '@/components/shopping-view/address';
import ShoppingOrders from '@/components/shopping-view/orders';

function ShoppingAccount() {
  return <div className="flex flex-col">
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
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="flex flex-col rounded-lg bg-background p-6 shadow-sm">
        <Tabs defaultValue='orders' className="w-full">
          <TabsList className="flex space-x-4 border-b">
            <TabsTrigger value='orders'>
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value='address'>
              <span>Address</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='orders'>
            <ShoppingOrders />
          </TabsContent>
          <TabsContent value='address'>
            <Address />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  </div>
}

export default ShoppingAccount;

