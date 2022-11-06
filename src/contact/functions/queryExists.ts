/*!
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { assertWid } from '../../assert';
import { Wid } from '../../whatsapp';
import { sendQueryExists } from '../../whatsapp/functions';

export interface QueryExistsResult {
  wid: Wid;
  biz: boolean;
  bizInfo?: {
    verifiedName?: {
      isApi: boolean;
      level: string;
      name: string;
      privacyMode: any;
      serial: string;
    };
  };
  disappearingMode?: {
    duration: number;
    settingTimestamp: number;
  };
}

const cache = new Map<string, QueryExistsResult | null>();

/**
 * Check if the number exists and what is correct ID
 *
 * This help to identify numbers with nine digit in Brazil
 *
 * @example
 * ```javascript
 * const result = await WPP.contact.queryExists('[number]@c.us');
 * console.log(result.wid); // Correct ID
 * ```
 *
 * @category Chat
 */
export async function queryExists(
  contactId: string | Wid
): Promise<QueryExistsResult | null> {
  const wid = assertWid(contactId);

  const id = wid.toString();

  if (cache.has(id)) {
    return cache.get(id)!;
  }

  const result = await sendQueryExists(wid).catch(() => null);

  cache.set(id, result);

  return result;
}