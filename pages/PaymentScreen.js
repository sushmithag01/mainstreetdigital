import {SafeAreaView, TouchableOpacity, Text, ScrollView} from 'react-native';
import styles from '../Common.css';
import {
  CardField,
  useStripe,
  StripeContainer,
} from '@stripe/stripe-react-native';

export default function PaymentScreen({
  productinfo,
  isChecked,
  setCardDetails,
  HandlePayment,
}) {
  const {confirmPayment} = useStripe();

  return (
    <StripeContainer keyboardShouldPersistTaps={false}>
      <SafeAreaView>
        <ScrollView>
          <CardField
            postalCodeEnabled={true}
            placeholders={{
              number: '4242 4242 4242 4242',
              postalCode: 'Zip Code',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 30,
              padding: 10,
            }}
            onCardChange={cardDetails => setCardDetails(cardDetails)}
            onFocus={focusedField => {
              console.log('focusField', focusedField);
            }}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.applybtn}
          onPress={() => HandlePayment()}>
          <Text style={styles.applytext}>
            Pay ${productinfo ? productinfo.voucher_offer_price : ''}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </StripeContainer>
  );
}
