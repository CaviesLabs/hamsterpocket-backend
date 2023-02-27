import * as fs from 'fs';

import { NetworkProvider } from '../providers/network.provider';
import { TokenMetadataProvider } from '../providers/token-metadata.provider';
import {
  EntityType,
  WhitelistEntity,
} from '../whitelist/entities/whitelist.entity';

const mintAddresses = [
  'So11111111111111111111111111111111111111112',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'EN4NSBJF6s3zkigrwcKRTBxC8pzCi5GU6NetPWCxVzZB',
  'H1G6sZ1WDoMmMCFqBKAbg9gkQPCo1sKQtaJWz9dHmqZr',
  '4m6ZNLrHxNueHMG6SVH3W7iSppJGpp8N5Uuu2VGdaaTW',
  '3x6CD2XgLtc3DVYVLepCSZBm9tGWKJDxbNzxYM8FaZXz',
  '8NFa3QXg3kKqvdmJNjUhzqwvAnUYA9F5R4ymyjJfHcVB',
  '9zg5shm8AemioXRiEkyCVmSm9oUJFgPSR5Dv5oGNu7jx',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'GH3brrZhyuZnR8MtAXWZGabRUj5cSD7E4zc6QqWgfS3P',
  '6t74dvBFeYqPzzp7hHxAVqnVehjp9H6ggNAvnpusjkiq',
  '5w3uHmXr3K1p7Vs2EY83hPnzo6tzN8J3j81nuPRJ98C4',
  '4Xi2PNCz5y7LCKoX1iui2ptyTE6AkMb2n6Z4kBf4uC8r',
  '4D7kEovLBEY3VQUzJUQjXyGR8fAZwQWSxEcsP5Y9nZ6S',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  '14n8NWraq5oeDi7SdtmFbQf8UXKTDqVc5rSjTEj4uRBL',
  'GXzAaq4pavCghS7Lsejapsb7ZTDUpDLDd3pGUJNTjtKt',
  'FokZeEip1XD7pw38MH86QJbfhzoqgwVdregryehzLhQf',
  'CrhCTXGbQd1bad8GjWbw7xYm4wxAzrrUb1xrzoqri2kU',
  'DyT12z3tnUokpy18XdKXQNxsGmgUzAA67JUPpj6dBRtd',
  'AgfUXiW2zFPuWPDRVSMGj5PW6Ygd7UACUixgZjjMgCyA',
  'H8B78oFvNXo2vfU7R3X47tVLuacWMZ95Cj28Gye51VqJ',
  'ENvD2Y49D6LQwKTtcxnKBmEMmSYJPWMxXhNsAo18jxNc',
  'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
  '3Bgwap1X4AkvfMyUSy6JgpuXbrGAbfqvQdVDFPNAUBPs',
  'DnUqKs84JJj75FbNmipaj1e9xSW78Y3ZPTNB4d4NcEYj',
  'seesdRrVekavUkAG78nQqKyszkCMZphg9uE1UdouEWv',
  '6naWDMGNWwqffJnnXFLBCLaYu1y5U9Rohe5wwJPHvf1p',
  'USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX',
  '3ruJEAXs7Ji6rzU15Mh7a6H4JHWZSrPSzN2j9xq5ojKq',
  'N2bRqFejkbx9bvCJNjbgK4wTcjf219SCv48BZHyGnus',
  'GsHJSt7szjNfCP6e2e449SDW5WHHKzGyjobyRBHowSMo',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  '6pCy1fgVXyfV2YhpN6pCqJioTgffVCPMC9KHFCQV5jGR',
  'ProtQG67xByzB6FehnpSbWpqgmD6AxDD2SMSipNxBpw',
  '446QX3TzHxgKdp7y6QD2akUbd8MSCPfqUW6sKHoy3jrj',
  'FE5CGW1wTNYtqJtNAzscUXZRHr6UYbjtkGJWjyufp2Uu',
  '6aYffgc6fDGWaiZXPoFjsLva5aBsarUY3StbKKu17gmR',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  '7XKtDrfPCfzSr5E1aKJ9vtAwzeWWMgMPPRfiHKMgA7VZ',
  '131zdKmQxXwHercCGS7Ps4QrT9eTqzdiK982HuoeDkRP',
  '2uTZnVCDi6BwyFMbYfBdbdUJfXznFBLnKYqYUbZuEyCj',
  'GVeCECteMCeUbPEafEqkzLjZ8RQCbejvPPmyaiXdkEuv',
  '7ab3VHJasAgjQEMqSCNsw45eU7N6ySQRwN1jDkJcQBV9',
  'G3cXvpNHLW1rJ7WaZP6BvgKJorfhAVJE2Y9vaYtVvpQo',
  'AYscEbGTQdZoecW8QUtQZnRcjAKjQL59wnMgxnmaLKNP',
  '4DsyGLJFhykeF8AgP8ZiTq1pK9BfAXk6EQtZz4c6rshj',
  'B4sVVHzuGHerqyMe8rJ4iw9LTBtVAkSsg5iim3wMdVU3',
  '2BpxSJm3NikiEQo9oo2nm1dYMYTugULAndYaVtygRhmR',
  '6HDScvZ4wkNm3nhfMMFs11GR2vDf4aijKDuvMLUjBREW',
  'CyyuL92ZKY9zUGpEfpocgckZjkPoEpxgWwKccMMsPgon',
  '6KnqT5fH9GdooJHMETBnLxsWYye5WZK3EHfMW7ySm4Q3',
  'G8P9pmJiDxcaDwWLXx2yPircDH17LxcqYUTDZjBv7Ajp',
  '8jXA7ub4t3gZrwNdsWgAtVTo571X3mk5n8HNJDZET1nv',
  '6fWbn18eNLBq2JYNKX2uFeuSrgZtezDRPV6KFe9EBBKh',
  'DzKaMiZcE1zTkZshRpd6SGxAU5PvQr6sdmA9SPCy6y1z',
  'H1KGh3mgxuxjc5rEe54vDyVJc9vD4cnsrWNn9MC29jcF',
  '8X6DcnTY5YsqoYqMU6mNHA4GE3uiJW2FZFsgGisQFk9q',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  '3acxNNmfdKKZj9i35P4VDBFm74Ufdt8ojKWceVGynwC5',
  '2mUfZUFdv7sw8HWBDonpYq5mUXc4kVFktAoZas5rtE1P',
  'A5FzPP6smgHkHDhkRbTqzZpEDYhpbhhhJ68NqZAbZCEX',
  'GkF7EMFK2TGsU5rdqivSqgp83qATBzC1LD17bzbXfZM4',
  '6PfoZY4iYBzpx3wHqgjBigNuGrN8tq7Bgp5DfiU6GpDJ',
  '4xGGBuyz7r7ps6Kb2Xt8Nh7B6hcGxTaC1pYvcxXJ83YG',
  '86gvJXeEM8WXqYtTqZkXTxnVqmaP1njZV3jjvWSU8yWj',
  'BHLPzx2PzKQKo4aLD8smeesyKfWNYYEcJD6uGz1YL9uF',
  '3iXEkccP8LTP8rwhRpsyMTPq2P5k9JuzGTTpkwWWcRA9',
  '6b6cXJEZTBTMJTR686MqLKp9279MYXAg43AE3CFyyd7o',
  '9TbdQqFkpsrds4ZwTo7N2Hha61ATsNhPjyzVhYM4Lw5o',
  '48dkz2KEvrLKHBhMgokgFmQ46hwptjvAwFoUdiiR8zHR',
  '56kuK7V85xruo9b5KcrCVvKhiRRtPqSPdgcN9wadq77Z',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'C666P76JksnRqdD2gfE4Fd94ZYZjdCa1QN29E2Hew9id',
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  'ovo2N3VqRfkZgbb56Gse7oLDXJLJEeqq5z9ePHRxhzL',
  'bozoPerkdbhUYXNtePV56wP8wYqhZmMzTTtkAXbeKeM',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'AQeh9KUZ7a1axjtumZguZwzUqFBnMnJBBywwP4aZE2wZ',
  'EgkopzZap8YUjtS7i4YYUjfkJr1KvSyrFbuHkZcc859J',
  '4vVwNaUyYWYZQb9vuM5zcPbyAZuoG2pZwgwDNzRUff4r',
  '4pk3pf9nJDN1im1kNwWJN1ThjE8pCYCTexXYGyFjqKVf',
  '25ykXZCdYq4czHveeZ1D5J18cZ7EqRAZ2zNdkWzGAMMz',
  'DoGGovZphGTPXaCCULAFgnVjRUrZJxV34kbz3kB25XRw',
  'BKMWPkPS8jXw59ezYwK2ueNTZRF4m8MYHDjh9HwUmkQ7',
  '3GNcsYCF8NBFw8mekVmYjudCZwQtRea3vr8qkysTtf4Z',
  '6Hr1VTkKYeGE3uL14mnKSuNi52e3FuHMQ1S9jrbYeT7j',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  '6GmfqGUBVTYrGHrPvCSXh1mxi9rKm86VEjffRX5j2Deg',
  'GPyzPHuFFGvN4yWWixt6TYUtDG49gfMdFFi2iniTmCkh',
];

async function generateWhitelist() {
  const metadataProvider = new TokenMetadataProvider(new NetworkProvider());
  const whitelist: Omit<WhitelistEntity, 'id'>[] = [];
  for (const address of mintAddresses) {
    const {
      data: { name, symbol, decimals, icon },
    } = await metadataProvider.getCurrencyDetail(address);
    whitelist.push({
      entityType: EntityType.TOKEN,
      address,
      name,
      symbol,
      decimals,
      image: icon,
    });
  }

  fs.writeFileSync(
    './src/assets/raydium.whitelist.json',
    JSON.stringify(whitelist),
  );
}

generateWhitelist();
