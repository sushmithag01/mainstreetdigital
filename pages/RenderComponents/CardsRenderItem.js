import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    FlatList,
} from 'react-native';
import styles from '../../Common.css';
import { useNavigation } from '@react-navigation/native';

function CardsRenderItem({ item }) {
    const navigation = useNavigation();
    const [ItemData, setItemData] = useState('');
    useEffect(() => {
        setItemData(item)
    }, [item])

    const HandelClick = item => {
        if (ItemData.item.flag === 'Voucher') {
            navigation.navigate('VoucherDetail', {
                state: { product: ItemData.item, pageName: 'explore' },
            });
        } else {
            navigation.navigate('CouponDetail', {
                state: { product: ItemData.item, pageName: 'explore' },
            });
        }
    };

    return (
        <>
            <TouchableOpacity onPress={() => HandelClick(ItemData)}>
                <View style={styles.cardmain}>
                    <View style={styles.cardinnerleft}>

                        <Image
                            source={ItemData?.item?.product_image ? { uri: ItemData.item.product_image } : require('../../assets/card.png')}
                            style={styles.cardimg}></Image>

                    </View>
                    <View style={styles.cardinnerright}>
                        <View style={styles.badgecontainer}>
                            <ImageBackground
                                source={require('../../assets/batch.png')}
                                resizeMode="cover"
                                style={styles.image}>
                                <Text style={styles.text}>{ItemData?.item?.flag}</Text>
                            </ImageBackground>
                        </View>
                        <Text style={styles.cardtext1} numberOfLines={1}>
                            {ItemData?.item?.category}
                        </Text>
                        <Text style={styles.cardtext2} numberOfLines={1}>
                            {ItemData?.item?.product_name}
                        </Text>
                        <Text style={styles.cardtext3} numberOfLines={1}>
                            by {ItemData?.item?.business_name}
                        </Text>
                        {
                            ItemData?.item?.flag === 'Voucher' ? (<View style={styles.pricemain}>
                                <Text style={styles.cardtext4}>
                                    $ {ItemData?.item?.product_actual_price}
                                </Text>
                                <Text style={styles.cardtext5}>
                                    $ {ItemData?.item?.product_offer_price}
                                </Text>
                                <Text style={styles.cardtext6}>
                                    {ItemData?.item?.offered_percent} % OFF
                                </Text>
                            </View>) : null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

export default CardsRenderItem